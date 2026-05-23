-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "products_categoryId_brandId_idx" ON "products"("categoryId", "brandId");

-- CreateIndex
CREATE INDEX "products_categoryId_price_idx" ON "products"("categoryId", "price");
