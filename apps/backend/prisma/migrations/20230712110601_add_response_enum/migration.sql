/*
  Warnings:

  - The `status` column on the `responses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `content` on table `responses` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "responses" ALTER COLUMN "content" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ResponseStatus" NOT NULL DEFAULT 'PENDING';
