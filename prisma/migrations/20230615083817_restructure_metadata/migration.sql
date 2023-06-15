/*
  Warnings:

  - You are about to drop the column `blockContentId` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `Metadata` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_blockContentId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_questionId_fkey";

-- DropIndex
DROP INDEX "Metadata_boardId_gradeId_moduleId_topicId_subtopicId_questi_key";

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "blockContentId",
DROP COLUMN "questionId";

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
CREATE UNIQUE INDEX "_QuestionToMetadata_AB_unique" ON "_QuestionToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToMetadata_B_index" ON "_QuestionToMetadata"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockContentToMetadata_AB_unique" ON "_BlockContentToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockContentToMetadata_B_index" ON "_BlockContentToMetadata"("B");

-- AddForeignKey
ALTER TABLE "_QuestionToMetadata" ADD CONSTRAINT "_QuestionToMetadata_A_fkey" FOREIGN KEY ("A") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToMetadata" ADD CONSTRAINT "_QuestionToMetadata_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToMetadata" ADD CONSTRAINT "_BlockContentToMetadata_A_fkey" FOREIGN KEY ("A") REFERENCES "BlockContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockContentToMetadata" ADD CONSTRAINT "_BlockContentToMetadata_B_fkey" FOREIGN KEY ("B") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
