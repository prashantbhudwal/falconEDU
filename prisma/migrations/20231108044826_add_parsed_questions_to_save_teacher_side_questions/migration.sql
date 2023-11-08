/*
  Warnings:

  - You are about to drop the column `correct_answer` on the `BotChatQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `hint` on the `BotChatQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `BotChatQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `question_number` on the `BotChatQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `question_type` on the `BotChatQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `sample_answer` on the `BotChatQuestions` table. All the data in the column will be lost.
  - Made the column `isCorrect` on table `BotChatQuestions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BotChatQuestions" DROP COLUMN "correct_answer",
DROP COLUMN "hint",
DROP COLUMN "question",
DROP COLUMN "question_number",
DROP COLUMN "question_type",
DROP COLUMN "sample_answer",
ADD COLUMN     "parsedQuestionsId" TEXT,
ALTER COLUMN "isCorrect" SET NOT NULL;

-- CreateTable
CREATE TABLE "parsedQuestions" (
    "id" TEXT NOT NULL,
    "botConfigId" TEXT NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "question" TEXT NOT NULL,
    "hint" TEXT,
    "question_number" INTEGER NOT NULL,
    "correct_answer" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sample_answer" TEXT,
    "max_score" DOUBLE PRECISION,

    CONSTRAINT "parsedQuestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parsedQuestions" ADD CONSTRAINT "parsedQuestions_botConfigId_fkey" FOREIGN KEY ("botConfigId") REFERENCES "BotConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChatQuestions" ADD CONSTRAINT "BotChatQuestions_parsedQuestionsId_fkey" FOREIGN KEY ("parsedQuestionsId") REFERENCES "parsedQuestions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
