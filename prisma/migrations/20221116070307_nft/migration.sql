/*
  Warnings:

  - A unique constraint covering the columns `[mediaHash]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nft_mediaHash_key" ON "Nft"("mediaHash");
