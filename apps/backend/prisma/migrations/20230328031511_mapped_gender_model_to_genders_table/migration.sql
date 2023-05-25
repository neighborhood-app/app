/*
  Warnings:

  - You are about to drop the `Gender` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "users_gender_fkey";

-- DropTable
DROP TABLE "Gender";

-- CreateTable
CREATE TABLE "genders" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(10),

    CONSTRAINT "genders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "users_gender_fkey" FOREIGN KEY ("genderID") REFERENCES "genders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
