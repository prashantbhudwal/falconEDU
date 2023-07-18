-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TRIAL', 'PRO');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "plan" TEXT,
    "isTrialUser" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "userType" "UserType" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TRIAL',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherProfile" (
    "id" TEXT NOT NULL,
    "classes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bio" TEXT NOT NULL DEFAULT '',
    "teachingExperience" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "board" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subTopic" TEXT NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingResource" (
    "id" SERIAL NOT NULL,
    "teacherId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,

    CONSTRAINT "TeachingResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonPlan" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "lessonBlockId" INTEGER NOT NULL,

    CONSTRAINT "LessonPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonBlock" (
    "id" SERIAL NOT NULL,
    "teachingResourceId" INTEGER NOT NULL,

    CONSTRAINT "LessonBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockContent" (
    "id" SERIAL NOT NULL,
    "lessonBlockId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,

    CONSTRAINT "BlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionBank" (
    "id" SERIAL NOT NULL,
    "teachingResourceId" INTEGER NOT NULL,

    CONSTRAINT "QuestionBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "question" TEXT,
    "bloomLevel" TEXT,
    "bloomLevelExplanation" TEXT,
    "explanation" TEXT,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answerKey" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "questionBankId" INTEGER,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionToMetadata" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockContentToMetadata" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherProfile_userId_key" ON "TeacherProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonBlock_teachingResourceId_key" ON "LessonBlock"("teachingResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToMetadata_AB_unique" ON "_QuestionToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToMetadata_B_index" ON "_QuestionToMetadata"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToMetadata_AB_unique" ON "_BlockContentToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToMetadata_B_index" ON "_BlockContentToMetadata"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingResource" ADD CONSTRAINT "TeachingResource_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonPlan" ADD CONSTRAINT "LessonPlan_lessonBlockId_fkey" FOREIGN KEY ("lessonBlockId") REFERENCES "LessonBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBlock" ADD CONSTRAINT "LessonBlock_teachingResourceId_fkey" FOREIGN KEY ("teachingResourceId") REFERENCES "TeachingResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockContent" ADD CONSTRAINT "BlockContent_lessonBlockId_fkey" FOREIGN KEY ("lessonBlockId") REFERENCES "LessonBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionBank" ADD CONSTRAINT "QuestionBank_teachingResourceId_fkey" FOREIGN KEY ("teachingResourceId") REFERENCES "TeachingResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "QuestionBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToMetadata" ADD CONSTRAINT "_QuestionToMetadata_A_fkey" FOREIGN KEY ("A") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToMetadata" ADD CONSTRAINT "_QuestionToMetadata_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToMetadata" ADD CONSTRAINT "_BlockContentToMetadata_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToMetadata" ADD CONSTRAINT "_BlockContentToMetadata_B_fkey" FOREIGN KEY ("B") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
