-- CreateTable
CREATE TABLE "Nft" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "blockChain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
