/*
  Warnings:

  - A unique constraint covering the columns `[user_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_password_hash_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");
