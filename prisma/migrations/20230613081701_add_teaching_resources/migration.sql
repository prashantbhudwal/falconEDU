-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('LESSON_PLAN', 'LESSON_BLOCK', 'QUESTION_BANK');

-- CreateEnum
CREATE TYPE "ideaType" AS ENUM ('STORY', 'EXAMPLE', 'ANALOGY', 'HISTORY', 'APPLICATION', 'ANTI_EXAMPLE', 'CONTRAST', 'DEFINITION', 'ACTIVITY', 'QUIZ');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('FILL_IN_THE_BLANKS', 'MULTIPLE_CHOICE_SINGLE_CORRECT', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'LONG_ANSWER', 'MATCH_THE_FOLLOWING', 'MULTIPLE_CHOICE_MULTIPLE_CORRECT', 'ORAL_TEST', 'PROJECT', 'CASE_STUDY', 'DEBATE', 'BRAINSTORMING', 'GROUP_DISCUSSION', 'WORKSHOP', 'SYMPOSIUM', 'PANEL_DISCUSSION');

-- AlterTable
ALTER TABLE "TeacherProfile" ADD COLUMN     "teachingExperience" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "lessonBlockId" INTEGER,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingResource" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "prerequisites" TEXT[],
    "targetedSkills" TEXT[],
    "duration" TEXT NOT NULL,
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
    "type" "QuestionType" NOT NULL,
    "questionId" TEXT,
    "question" TEXT,
    "bloomLevel" TEXT,
    "topic" TEXT,
    "subtopic" TEXT,
    "grade" TEXT,
    "bloomLevelExplanation" TEXT,
    "board" TEXT,
    "explanation" TEXT,
    "learningObjectives" TEXT[],
    "tags" TEXT[],
    "author" TEXT,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answerKey" TEXT,
    "questionBankId" INTEGER,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeachingResourceToTopic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonBlock_teachingResourceId_key" ON "LessonBlock"("teachingResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "_TeachingResourceToTopic_AB_unique" ON "_TeachingResourceToTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_TeachingResourceToTopic_B_index" ON "_TeachingResourceToTopic"("B");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_lessonBlockId_fkey" FOREIGN KEY ("lessonBlockId") REFERENCES "LessonBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "_TeachingResourceToTopic" ADD CONSTRAINT "_TeachingResourceToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "TeachingResource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeachingResourceToTopic" ADD CONSTRAINT "_TeachingResourceToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
