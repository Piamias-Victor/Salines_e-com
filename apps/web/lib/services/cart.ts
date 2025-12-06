import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getActivePromotion, calculatePromotionPrice, isPromotionExpired } from '@/lib/utils/promotion';

export const CART_COOKIE_NAME = 'cart_session';

export const cartService = {
    /**
     * Get or create a cart session token
     */
    async getSessionToken(): Promise<string> {
        const cookieStore = await cookies();
        const token = cookieStore.get(CART_COOKIE_NAME)?.value;

        if (token) return token;

        // Create new token if not exists
        const newToken = crypto.randomUUID();
        // Note: We can't set cookies here in a server action/service directly if called from a component
        // But for API routes it's fine to read. Setting usually happens in middleware or route handler response.
        // For now, we'll return the token and let the caller handle setting the cookie if needed.
        return newToken;
    },

    /**
     * Get the current cart
     */
    async getCart(userId?: string) {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(CART_COOKIE_NAME)?.value;

        if (!userId && !sessionToken) return null;

        return prisma.cart.findFirst({
            where: {
                OR: [
                    ...(userId ? [{ userId }] : []),
                    ...(sessionToken ? [{ sessionToken }] : []),
                ],
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                priceTTC: true,
                                imageUrl: true,
                                weight: true,
                                stock: true,
                                maxOrderQuantity: true,
                            },
                        },
                        appliedPromotion: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            }
        });
    },

    /**
     * Add item to cart
     */
    async addToCart(productId: string, quantity: number, userId?: string, explicitSessionToken?: string) {
        const cookieStore = await cookies();
        let sessionToken = explicitSessionToken || cookieStore.get(CART_COOKIE_NAME)?.value;

        if (!sessionToken && !userId) {
            // Should be handled by the caller to ensure a session exists
            throw new Error('No session found');
        }

        // 1. Get Product to check stock and promotions
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                promotions: {
                    include: { promotion: true },
                    where: { promotion: { isActive: true } },
                },
            },
        });

        if (!product) throw new Error('Product not found');

        // Check stock
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        // Calculate promotion price
        const activePromotion = getActivePromotion(product as any);
        const priceCalc = calculatePromotionPrice(Number(product.priceTTC), activePromotion);

        // Check max order quantity
        if (product.maxOrderQuantity && quantity > product.maxOrderQuantity) {
            throw new Error(`Max order quantity is ${product.maxOrderQuantity}`);
        }

        // 2. Get or Create Cart
        let cart = await prisma.cart.findFirst({
            where: {
                OR: [
                    ...(userId ? [{ userId }] : []),
                    ...(sessionToken ? [{ sessionToken }] : []),
                ],
            },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    sessionToken: !userId ? sessionToken : undefined,
                },
            });
            console.log('[CART SERVICE] New cart created:', { id: cart.id, userId, sessionToken });
        } else {
            console.log('[CART SERVICE] Using existing cart:', { id: cart.id, userId, sessionToken });
        }

        // 3. Add or Update Item
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            // Re-check limits with new total quantity
            if (product.stock < newQuantity) {
                throw new Error(`Not enough stock. Available: ${product.stock}`);
            }
            if (product.maxOrderQuantity && newQuantity > product.maxOrderQuantity) {
                throw new Error(`Max order quantity is ${product.maxOrderQuantity}`);
            }

            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: newQuantity,
                    appliedPromotionId: activePromotion?.id,
                    appliedPromotionPrice: priceCalc.hasPromotion ? priceCalc.finalPrice : null,
                },
            });
        } else {
            return prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                    appliedPromotionId: activePromotion?.id,
                    appliedPromotionPrice: priceCalc.hasPromotion ? priceCalc.finalPrice : null,
                },
            });
        }
    },

    /**
     * Update item quantity
     */
    async updateItemQuantity(itemId: string, quantity: number) {
        if (quantity <= 0) {
            return this.removeItem(itemId);
        }

        const item = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { product: true },
        });

        if (!item) throw new Error('Item not found');

        // Check limits
        if (item.product.stock < quantity) {
            throw new Error(`Not enough stock. Available: ${item.product.stock}`);
        }
        if (item.product.maxOrderQuantity && quantity > item.product.maxOrderQuantity) {
            throw new Error(`Max order quantity is ${item.product.maxOrderQuantity}`);
        }

        return prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    },

    /**
     * Remove item from cart
     */
    async removeItem(itemId: string) {
        return prisma.cartItem.delete({
            where: { id: itemId },
        });
    },

    /**
     * Clean expired promotions from cart
     * This should be called when loading the cart to ensure promotions are still valid
     */
    async cleanExpiredPromotions(cartId: string) {
        const items = await prisma.cartItem.findMany({
            where: { cartId },
            include: { appliedPromotion: true },
        });

        const updates = [];

        for (const item of items) {
            if (item.appliedPromotion && isPromotionExpired(item.appliedPromotion)) {
                updates.push(
                    prisma.cartItem.update({
                        where: { id: item.id },
                        data: {
                            appliedPromotionId: null,
                            appliedPromotionPrice: null,
                        },
                    })
                );
            }
        }

        if (updates.length > 0) {
            await prisma.$transaction(updates);
        }

        return updates.length;
    },
};
