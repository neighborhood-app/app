/*
  Warnings:

  - Made the column `time_created` on table `responses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "responses" ALTER COLUMN "time_created" SET NOT NULL,
ALTER COLUMN "time_created" SET DEFAULT CURRENT_TIMESTAMP;
