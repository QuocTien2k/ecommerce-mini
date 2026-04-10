-- CreateEnum
CREATE TYPE "VoucherScope" AS ENUM ('ORDER', 'PRODUCT', 'CATEGORY');

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "scope" "VoucherScope" NOT NULL DEFAULT 'ORDER';

-- CreateTable
CREATE TABLE "UserVoucher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),
    "usagePerUser" INTEGER,

    CONSTRAINT "UserVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToVoucher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToVoucher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVoucher_userId_voucherId_key" ON "UserVoucher"("userId", "voucherId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToVoucher_AB_unique" ON "_CategoryToVoucher"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToVoucher_B_index" ON "_CategoryToVoucher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToVoucher_AB_unique" ON "_ProductToVoucher"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToVoucher_B_index" ON "_ProductToVoucher"("B");

-- AddForeignKey
ALTER TABLE "UserVoucher" ADD CONSTRAINT "UserVoucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVoucher" ADD CONSTRAINT "UserVoucher_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVoucher" ADD CONSTRAINT "_CategoryToVoucher_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVoucher" ADD CONSTRAINT "_CategoryToVoucher_B_fkey" FOREIGN KEY ("B") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToVoucher" ADD CONSTRAINT "_ProductToVoucher_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToVoucher" ADD CONSTRAINT "_ProductToVoucher_B_fkey" FOREIGN KEY ("B") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
