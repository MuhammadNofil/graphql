/*
  Warnings:

  - Added the required column `walletAddress` to the `GroupInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupInvite" ADD COLUMN     "walletAddress" TEXT NOT NULL;
