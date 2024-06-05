-- CreateTable
CREATE TABLE "ReportNft" (
    "id" TEXT NOT NULL,
    "reporterProfileId" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "description" TEXT,
    "reportType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "ReportNft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportNft" ADD CONSTRAINT "ReportNft_reporterProfileId_fkey" FOREIGN KEY ("reporterProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportNft" ADD CONSTRAINT "ReportNft_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
