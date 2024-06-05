-- CreateTable
CREATE TABLE "RateNft" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RateNft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RateNft" ADD CONSTRAINT "RateNft_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateNft" ADD CONSTRAINT "RateNft_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
