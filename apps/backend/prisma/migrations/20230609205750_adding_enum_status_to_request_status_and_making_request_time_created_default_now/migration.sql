/*
  Warnings:

  - The `status` column on the `requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `time_created` on table `requests` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN',
ALTER COLUMN "time_created" SET NOT NULL,
ALTER COLUMN "time_created" SET DEFAULT CURRENT_TIMESTAMP;
