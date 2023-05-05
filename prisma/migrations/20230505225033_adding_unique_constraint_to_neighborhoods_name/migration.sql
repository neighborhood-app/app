/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `neighborhoods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "neighborhoods_name_key" ON "neighborhoods"("name");
