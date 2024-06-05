/*
  Warnings:

  - The values [DISPLIEK] on the enum `RATING` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RATING_new" AS ENUM ('LIKE', 'DISLIKE');
ALTER TABLE "RateNft" ALTER COLUMN "rating" DROP DEFAULT;
ALTER TABLE "RateNft" ALTER COLUMN "rating" TYPE "RATING_new" USING ("rating"::text::"RATING_new");
ALTER TYPE "RATING" RENAME TO "RATING_old";
ALTER TYPE "RATING_new" RENAME TO "RATING";
DROP TYPE "RATING_old";
ALTER TABLE "RateNft" ALTER COLUMN "rating" SET DEFAULT 'LIKE';
COMMIT;
