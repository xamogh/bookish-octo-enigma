-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('LifeMember', 'HonoraryMember', 'BoardMember', 'GeneralMember');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('VALIDATED', 'VALIDATION_PENDING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "PasswordToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "uniqueKey" TEXT,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'VALIDATION_PENDING',
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isSanghaMember" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sanghaJoinDate" TIMESTAMP(3),
    "refugeName" TEXT,
    "gender" "GenderType",
    "yearOfBirth" INTEGER,
    "memberShip" "MembershipType",
    "email" TEXT,
    "middleName" TEXT,
    "title" TEXT,
    "phoneMobile" TEXT,
    "phoneLand" TEXT,
    "phoneOther" TEXT,
    "viberNumber" TEXT,
    "note" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "uniqueKey" TEXT,
    "currentAddressId" INTEGER,
    "permanentAddressId" INTEGER,
    "addressId" INTEGER,
    "centreId" INTEGER,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "stateProvince" TEXT,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uniqueKey" TEXT,
    "updatedBy" TEXT,
    "createdBy" TEXT,
    "memberId" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Centre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayText" TEXT NOT NULL,
    "displaySequence" INTEGER NOT NULL,
    "streetAddress" TEXT,
    "city" TEXT,
    "stateProvince" TEXT,
    "country" TEXT,

    CONSTRAINT "Centre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uniqueKey" TEXT,
    "updatedBy" TEXT,
    "createdBy" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupToMember" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordToken_userId_key" ON "PasswordToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueKey_key" ON "User"("uniqueKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_memberId_key" ON "User"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_uniqueKey_key" ON "Member"("uniqueKey");

-- CreateIndex
CREATE UNIQUE INDEX "Member_currentAddressId_key" ON "Member"("currentAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_permanentAddressId_key" ON "Member"("permanentAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_uniqueKey_key" ON "Address"("uniqueKey");

-- CreateIndex
CREATE UNIQUE INDEX "Centre_name_key" ON "Centre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_uniqueKey_key" ON "Group"("uniqueKey");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToMember_AB_unique" ON "_GroupToMember"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToMember_B_index" ON "_GroupToMember"("B");

-- AddForeignKey
ALTER TABLE "PasswordToken" ADD CONSTRAINT "PasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_currentAddressId_fkey" FOREIGN KEY ("currentAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_permanentAddressId_fkey" FOREIGN KEY ("permanentAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToMember" ADD CONSTRAINT "_GroupToMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToMember" ADD CONSTRAINT "_GroupToMember_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
