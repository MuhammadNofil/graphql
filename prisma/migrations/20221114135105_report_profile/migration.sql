-- CreateTable
CREATE TABLE "ReportProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "reportedProfileId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "description" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReportProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportProfile" ADD CONSTRAINT "ReportProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportProfile" ADD CONSTRAINT "ReportProfile_reportedProfileId_fkey" FOREIGN KEY ("reportedProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
