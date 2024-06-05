-- DropIndex
DROP INDEX "GroupInvite_email_key";

-- AlterTable
ALTER TABLE "GroupInvite" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "walletAddress" DROP NOT NULL;
