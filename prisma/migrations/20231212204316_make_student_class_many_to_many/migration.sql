/*
  Warnings:

  - You are about to drop the column `classId` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_classId_fkey";

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "classId";

-- CreateTable
CREATE TABLE "_ClassToStudentProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToStudentProfile_AB_unique" ON "_ClassToStudentProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToStudentProfile_B_index" ON "_ClassToStudentProfile"("B");

-- AddForeignKey
ALTER TABLE "_ClassToStudentProfile" ADD CONSTRAINT "_ClassToStudentProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudentProfile" ADD CONSTRAINT "_ClassToStudentProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
