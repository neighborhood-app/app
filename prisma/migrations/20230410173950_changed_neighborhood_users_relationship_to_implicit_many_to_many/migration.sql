/*
  Warnings:

  - You are about to drop the `neighborhoods_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "neighborhoods_users" DROP CONSTRAINT "neighborhoods_users_neighborhood_id_fkey";

-- DropForeignKey
ALTER TABLE "neighborhoods_users" DROP CONSTRAINT "neighborhoods_users_user_id_fkey";

-- DropTable
DROP TABLE "neighborhoods_users";

-- CreateTable
CREATE TABLE "_NeighborhoodToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NeighborhoodToUser_AB_unique" ON "_NeighborhoodToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_NeighborhoodToUser_B_index" ON "_NeighborhoodToUser"("B");

-- AddForeignKey
ALTER TABLE "_NeighborhoodToUser" ADD CONSTRAINT "_NeighborhoodToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "neighborhoods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NeighborhoodToUser" ADD CONSTRAINT "_NeighborhoodToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
