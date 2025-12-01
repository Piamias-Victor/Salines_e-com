/*
  Warnings:

  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand";

-- CreateTable
CREATE TABLE "product_brands" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_brands_brandId_idx" ON "product_brands"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "product_brands_productId_brandId_key" ON "product_brands"("productId", "brandId");

-- AddForeignKey
ALTER TABLE "product_brands" ADD CONSTRAINT "product_brands_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
