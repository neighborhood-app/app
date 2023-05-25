/*
  Warnings:

  - You are about to alter the column `admin_id` on the `neighborhoods` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Integer`.

*/
-- AlterTable
ALTER TABLE "neighborhoods" ALTER COLUMN "admin_id" SET DATA TYPE INTEGER;
