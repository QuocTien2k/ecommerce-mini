/*
  Warnings:

  - Made the column `variantType` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "variantType" SET NOT NULL;
