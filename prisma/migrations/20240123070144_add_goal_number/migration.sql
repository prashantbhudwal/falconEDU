/*
  Warnings:

  - Added the required column `goalNumber` to the `LearningGoals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LearningGoals" ADD COLUMN     "goalNumber" INTEGER NOT NULL;
