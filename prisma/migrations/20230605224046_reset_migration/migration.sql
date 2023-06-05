-- CreateEnum
CREATE TYPE "IndividualPlanType" AS ENUM ('MONTHLY', 'THREE_MONTHS', 'SIX_MONTHS', 'YEARLY', 'TRIAL');

-- CreateEnum
CREATE TYPE "SchoolPlanType" AS ENUM ('SCHOOL_MONTHLY', 'SCHOOL_YEARLY', 'TRIAL');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'SCHOOL');

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'chubby.png',
    "accountType" "AccountType" NOT NULL,
    "schoolId" INTEGER,
    "schoolSubscriptionId" INTEGER,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherProfile" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "professionalInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndividualSubscription" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "plan" "IndividualPlanType" NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "IndividualSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSubscription" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "plan" "SchoolPlanType" NOT NULL,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "SchoolSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherProfile_teacherId_key" ON "TeacherProfile"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "IndividualSubscription_teacherId_key" ON "IndividualSubscription"("teacherId");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolSubscriptionId_fkey" FOREIGN KEY ("schoolSubscriptionId") REFERENCES "SchoolSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualSubscription" ADD CONSTRAINT "IndividualSubscription_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubscription" ADD CONSTRAINT "SchoolSubscription_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
