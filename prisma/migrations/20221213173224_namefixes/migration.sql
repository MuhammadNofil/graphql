/*
  Warnings:

  - You are about to drop the column `nftType` on the `Nft` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Nft" DROP COLUMN "nftType",
ADD COLUMN     "type" "NFT_TYPE" NOT NULL DEFAULT 'FORE';
