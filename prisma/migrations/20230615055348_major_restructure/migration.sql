/*
  Warnings:

  - You are about to drop the column `author` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `board` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `learningObjectives` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `subtopic` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `Question` table. All the data in the column will be lost.
  - The `answerKey` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `classId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `lessonBlockId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `TeachingResource` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `TeachingResource` table. All the data in the column will be lost.
  - You are about to drop the column `prerequisites` on the `TeachingResource` table. All the data in the column will be lost.
  - You are about to drop the column `targetedSkills` on the `TeachingResource` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeachingResourceToTopic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gradeId` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleId` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_classId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_lessonBlockId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "_TeachingResourceToTopic" DROP CONSTRAINT "_TeachingResourceToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeachingResourceToTopic" DROP CONSTRAINT "_TeachingResourceToTopic_B_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "author",
DROP COLUMN "board",
DROP COLUMN "grade",
DROP COLUMN "learningObjectives",
DROP COLUMN "subtopic",
DROP COLUMN "tags",
DROP COLUMN "topic",
DROP COLUMN "answerKey",
ADD COLUMN     "answerKey" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "classId",
DROP COLUMN "lessonBlockId",
ADD COLUMN     "gradeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeachingResource" DROP COLUMN "difficulty",
DROP COLUMN "duration",
DROP COLUMN "prerequisites",
DROP COLUMN "targetedSkills";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "subjectId",
ADD COLUMN     "moduleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "_TeachingResourceToTopic";

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "board" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "teacherId" INTEGER,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtopic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "Subtopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "boardId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "subtopicId" INTEGER NOT NULL,
    "questionId" INTEGER,
    "blockContentId" INTEGER,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_boardId_key" ON "Grade"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "Metadata_boardId_gradeId_moduleId_topicId_subtopicId_questi_key" ON "Metadata"("boardId", "gradeId", "moduleId", "topicId", "subtopicId", "questionId", "blockContentId");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtopic" ADD CONSTRAINT "Subtopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_blockContentId_fkey" FOREIGN KEY ("blockContentId") REFERENCES "BlockContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
