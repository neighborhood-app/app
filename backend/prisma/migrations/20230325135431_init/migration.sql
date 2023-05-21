-- CreateTable
CREATE TABLE "Gender" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(10),

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" SERIAL NOT NULL,
    "adminID" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50),
    "location" VARCHAR(50),

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeighborhoodUsers" (
    "neighborhoodID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "NeighborhoodUsers_pkey" PRIMARY KEY ("neighborhoodID","userID")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "neighborhoodID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "status" INTEGER,
    "timeCreated" TIMESTAMPTZ(6),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "requestID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "content" VARCHAR(1000),
    "status" INTEGER,
    "timeCreated" TIMESTAMPTZ(6),

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" VARCHAR(25) NOT NULL,
    "password" VARCHAR(25) NOT NULL,
    "firstName" VARCHAR(25),
    "lastName" VARCHAR(25),
    "dob" DATE,
    "genderID" INTEGER,
    "bio" VARCHAR(500),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_adminID_key" ON "Neighborhood"("adminID");

-- AddForeignKey
ALTER TABLE "Neighborhood" ADD CONSTRAINT "Neighborhood_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NeighborhoodUsers" ADD CONSTRAINT "NeighborhoodUsers_neighborhoodID_fkey" FOREIGN KEY ("neighborhoodID") REFERENCES "Neighborhood"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NeighborhoodUsers" ADD CONSTRAINT "NeighborhoodUsers_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_neighborhoodID_fkey" FOREIGN KEY ("neighborhoodID") REFERENCES "Neighborhood"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_requestID_fkey" FOREIGN KEY ("requestID") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "users_gender_fkey" FOREIGN KEY ("genderID") REFERENCES "Gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
