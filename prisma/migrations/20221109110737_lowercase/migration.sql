/*
  Warnings:

  - You are about to drop the column `DateOfBirth` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "DateOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);
