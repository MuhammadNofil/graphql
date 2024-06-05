/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "isVerified",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
