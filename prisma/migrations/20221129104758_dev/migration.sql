-- -- CreateTable
-- CREATE TABLE "GroupInvite" (
--     "id" TEXT NOT NULL,
--     "invitedByProfileId" TEXT NOT NULL,
--     "groupId" TEXT NOT NULL,
--     "email" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3),
--     "deleted" BOOLEAN NOT NULL DEFAULT false,

--     CONSTRAINT "GroupInvite_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateIndex
-- CREATE UNIQUE INDEX "GroupInvite_email_key" ON "GroupInvite"("email");

-- -- AddForeignKey
-- ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_invitedByProfileId_fkey" FOREIGN KEY ("invitedByProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
