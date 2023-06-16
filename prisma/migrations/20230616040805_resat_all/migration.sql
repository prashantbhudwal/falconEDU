-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('LESSON_PLAN', 'LESSON_BLOCK', 'QUESTION_BANK');

-- CreateEnum
CREATE TYPE "ideaType" AS ENUM ('STORY', 'EXAMPLE', 'ANALOGY', 'HISTORY', 'APPLICATION', 'ANTI_EXAMPLE', 'CONTRAST', 'DEFINITION', 'ACTIVITY', 'QUIZ');

-- CreateEnum
CREATE TYPE "IndividualPlanType" AS ENUM ('MONTHLY', 'THREE_MONTHS', 'SIX_MONTHS', 'YEARLY', 'TRIAL');

-- CreateEnum
CREATE TYPE "SchoolPlanType" AS ENUM ('SCHOOL_MONTHLY', 'SCHOOL_YEARLY', 'TRIAL');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'SCHOOL');

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "board" TEXT NOT NULL,
    "grade" "Grade" NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subTopic" TEXT NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingResource" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "resourceType" "ResourceType" NOT NULL,

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
    "text" JSONB NOT NULL,
    "type" "ideaType" NOT NULL,
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
    "classes" "Grade"[],

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherProfile" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "teachingExperience" INTEGER NOT NULL DEFAULT 0,
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
CREATE UNIQUE INDEX "LessonBlock_teachingResourceId_key" ON "LessonBlock"("teachingResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherProfile_teacherId_key" ON "TeacherProfile"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "IndividualSubscription_teacherId_key" ON "IndividualSubscription"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToMetadata_AB_unique" ON "_QuestionToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToMetadata_B_index" ON "_QuestionToMetadata"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToMetadata_AB_unique" ON "_BlockContentToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToMetadata_B_index" ON "_BlockContentToMetadata"("B");

-- AddForeignKey
ALTER TABLE "TeachingResource" ADD CONSTRAINT "TeachingResource_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolSubscriptionId_fkey" FOREIGN KEY ("schoolSubscriptionId") REFERENCES "SchoolSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualSubscription" ADD CONSTRAINT "IndividualSubscription_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubscription" ADD CONSTRAINT "SchoolSubscription_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToMetadata" ADD CONSTRAINT "_QuestionToMetadata_A_fkey" FOREIGN KEY ("A") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToMetadata" ADD CONSTRAINT "_QuestionToMetadata_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToMetadata" ADD CONSTRAINT "_BlockContentToMetadata_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToMetadata" ADD CONSTRAINT "_BlockContentToMetadata_B_fkey" FOREIGN KEY ("B") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
