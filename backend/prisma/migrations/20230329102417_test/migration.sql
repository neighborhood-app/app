/*
  Warnings:

  - You are about to drop the column `adminID` on the `neighborhoods` table. All the data in the column will be lost.
  - The primary key for the `neighborhoods_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `neighborhoodID` on the `neighborhoods_users` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `neighborhoods_users` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhoodID` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `timeCreated` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `requestID` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `timeCreated` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `genderID` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `users` table. All the data in the column will be lost.
  - Added the required column `admin_id` to the `neighborhoods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood_id` to the `neighborhoods_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `neighborhoods_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood_id` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_id` to the `responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "neighborhoods" DROP CONSTRAINT "neighborhoods_adminID_fkey";

-- DropForeignKey
ALTER TABLE "neighborhoods_users" DROP CONSTRAINT "neighborhoods_users_neighborhoodID_fkey";

-- DropForeignKey
ALTER TABLE "neighborhoods_users" DROP CONSTRAINT "neighborhoods_users_userID_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_neighborhoodID_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_userID_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_requestID_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_userID_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_gender_fkey";

-- DropIndex
DROP INDEX "neighborhoods_adminID_key";

-- DropIndex
DROP INDEX "users_userName_key";

-- AlterTable
ALTER TABLE "neighborhoods" DROP COLUMN "adminID",
ADD COLUMN     "admin_id" DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE "neighborhoods_users" DROP CONSTRAINT "neighborhoods_users_pkey",
DROP COLUMN "neighborhoodID",
DROP COLUMN "userID",
ADD COLUMN     "neighborhood_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "active" DROP DEFAULT,
ADD CONSTRAINT "neighborhoods_users_pkey" PRIMARY KEY ("neighborhood_id", "user_id");

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "neighborhoodID",
DROP COLUMN "timeCreated",
DROP COLUMN "userID",
ADD COLUMN     "neighborhood_id" INTEGER NOT NULL,
ADD COLUMN     "time_created" TIMESTAMPTZ(6),
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "responses" DROP COLUMN "requestID",
DROP COLUMN "timeCreated",
DROP COLUMN "userID",
ADD COLUMN     "request_id" INTEGER NOT NULL,
ADD COLUMN     "time_created" TIMESTAMPTZ(6),
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "genderID",
DROP COLUMN "lastName",
DROP COLUMN "userName",
ADD COLUMN     "first_name" VARCHAR(25),
ADD COLUMN     "gender_id" INTEGER,
ADD COLUMN     "last_name" VARCHAR(25),
ADD COLUMN     "user_name" VARCHAR(25) NOT NULL;

-- AddForeignKey
ALTER TABLE "neighborhoods_users" ADD CONSTRAINT "neighborhoods_users_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "neighborhoods_users" ADD CONSTRAINT "neighborhoods_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_neighborhood_id_fkey" FOREIGN KEY ("neighborhood_id") REFERENCES "neighborhoods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gender_fkey" FOREIGN KEY ("gender_id") REFERENCES "genders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
