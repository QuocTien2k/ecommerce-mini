/*
  Warnings:

  - A unique constraint covering the columns `[productId,color,attributesHash]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "attributesHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_color_attributesHash_key" ON "product_variants"("productId", "color", "attributesHash");
