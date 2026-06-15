/*
  Warnings:

  - Made the column `thumbnail` on table `brands` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "thumbnail" SET NOT NULL;
