/*
  Warnings:

  - You are about to alter the column `name` on the `neighborhoods` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE "neighborhoods" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30);
