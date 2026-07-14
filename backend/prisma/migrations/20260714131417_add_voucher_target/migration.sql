-- CreateEnum
CREATE TYPE "VoucherTarget" AS ENUM ('GLOBAL', 'PERSONAL');

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "target" "VoucherTarget" NOT NULL DEFAULT 'GLOBAL';
