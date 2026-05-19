/*
  Warnings:

  - The `variantType` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('NONE', 'SIZE_COLOR', 'STORAGE', 'SPEC', 'SWITCH', 'CUSTOM');

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "variantType",
ADD COLUMN     "variantType" "VariantType";
