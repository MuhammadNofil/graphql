/*
  Warnings:

  - Added the required column `mediaHash` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "mediaHash" TEXT NOT NULL;
