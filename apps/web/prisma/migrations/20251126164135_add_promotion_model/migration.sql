-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('EURO', 'PERCENT');

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "PromotionType" NOT NULL,
    "redirectUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_promotions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "promotions_isActive_idx" ON "promotions"("isActive");

-- CreateIndex
CREATE INDEX "promotions_position_idx" ON "promotions"("position");

-- CreateIndex
CREATE INDEX "product_promotions_promotionId_idx" ON "product_promotions"("promotionId");

-- CreateIndex
CREATE UNIQUE INDEX "product_promotions_productId_promotionId_key" ON "product_promotions"("productId", "promotionId");

-- AddForeignKey
ALTER TABLE "product_promotions" ADD CONSTRAINT "product_promotions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_promotions" ADD CONSTRAINT "product_promotions_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
