/*
  Warnings:

  - You are about to drop the `Neighborhood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NeighborhoodUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Neighborhood" DROP CONSTRAINT "Neighborhood_adminID_fkey";

-- DropForeignKey
ALTER TABLE "NeighborhoodUsers" DROP CONSTRAINT "NeighborhoodUsers_neighborhoodID_fkey";

-- DropForeignKey
ALTER TABLE "NeighborhoodUsers" DROP CONSTRAINT "NeighborhoodUsers_userID_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_neighborhoodID_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userID_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_requestID_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_userID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "users_gender_fkey";

-- DropTable
DROP TABLE "Neighborhood";

-- DropTable
DROP TABLE "NeighborhoodUsers";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "Response";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "neighborhoods" (
    "id" SERIAL NOT NULL,
    "adminID" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50),
    "location" VARCHAR(50),

    CONSTRAINT "neighborhoods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neighborhoods_users" (
    "neighborhoodID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "active" BOOLEAN DEFAULT true,

    CONSTRAINT "neighborhoods_users_pkey" PRIMARY KEY ("neighborhoodID","userID")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "neighborhoodID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "status" INTEGER,
    "timeCreated" TIMESTAMPTZ(6),

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" SERIAL NOT NULL,
    "requestID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "content" VARCHAR(1000),
    "status" INTEGER,
    "timeCreated" TIMESTAMPTZ(6),

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "userName" VARCHAR(25) NOT NULL,
    "password" VARCHAR(25) NOT NULL,
    "firstName" VARCHAR(25),
    "lastName" VARCHAR(25),
    "dob" DATE,
    "genderID" INTEGER,
    "bio" VARCHAR(500),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "neighborhoods_adminID_key" ON "neighborhoods"("adminID");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "neighborhoods_users" ADD CONSTRAINT "neighborhoods_users_neighborhoodID_fkey" FOREIGN KEY ("neighborhoodID") REFERENCES "neighborhoods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "neighborhoods_users" ADD CONSTRAINT "neighborhoods_users_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_neighborhoodID_fkey" FOREIGN KEY ("neighborhoodID") REFERENCES "neighborhoods"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_requestID_fkey" FOREIGN KEY ("requestID") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gender_fkey" FOREIGN KEY ("genderID") REFERENCES "genders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
