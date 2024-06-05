-- DropForeignKey
ALTER TABLE "ReportNft" DROP CONSTRAINT "ReportNft_nftId_fkey";

-- AlterTable
ALTER TABLE "ReportNft" ALTER COLUMN "nftId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ReportNft" ADD CONSTRAINT "ReportNft_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
