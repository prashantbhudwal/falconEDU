-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('SCHOOL', 'TUTORIAL', 'COLLEGE', 'COMPANY', 'OTHER');

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "orgId" TEXT;

-- AlterTable
ALTER TABLE "TeacherProfile" ADD COLUMN     "orgId" TEXT,
ADD COLUMN     "orgMode" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "OrgAdminProfile" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OrgAdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Org" (
    "id" TEXT NOT NULL,
    "type" "OrgType" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrgAdminProfile_userId_key" ON "OrgAdminProfile"("userId");

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgAdminProfile" ADD CONSTRAINT "OrgAdminProfile_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgAdminProfile" ADD CONSTRAINT "OrgAdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE SET NULL ON UPDATE CASCADE;
