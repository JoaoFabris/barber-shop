/*
  Warnings:

  - You are about to drop the column `ratingCount` on the `Rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "ratingCount";
