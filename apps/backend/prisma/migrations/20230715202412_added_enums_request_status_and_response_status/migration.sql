/*
  Warnings:

  - The `status` column on the `requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'OPEN';

-- DropEnum
DROP TYPE "Status";
