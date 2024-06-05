/*
  Warnings:

  - Made the column `nftId` on table `ReportNft` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ReportNft" DROP CONSTRAINT "ReportNft_nftId_fkey";

-- AlterTable
ALTER TABLE "ReportNft" ALTER COLUMN "nftId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ReportNft" ADD CONSTRAINT "ReportNft_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
