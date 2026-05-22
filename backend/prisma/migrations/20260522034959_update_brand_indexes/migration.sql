-- DropIndex
DROP INDEX "brands_slug_idx";

-- CreateIndex
CREATE INDEX "brands_isActive_idx" ON "brands"("isActive");

-- CreateIndex
CREATE INDEX "brands_createdAt_idx" ON "brands"("createdAt");
