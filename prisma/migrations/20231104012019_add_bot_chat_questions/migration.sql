-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER', 'OBJECTIVE_TRUE_FALSE', 'OBJECTIVE_FILL_IN_THE_BLANK_SINGLE_ANSWER', 'OBJECTIVE_FILL_IN_THE_BLANK_MULTIPLE_ANSWER', 'OBJECTIVE_MATCH_THE_FOLLOWING', 'OBJECTIVE_MULTIPLE_CHOICE_MULTIPLE_ANSWER', 'SUBJECTIVE_ESSAY', 'SUBJECTIVE_SHORT_ANSWER', 'OTHER');

-- CreateTable
CREATE TABLE "BotChatQuestions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "botChatId" TEXT NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "question" TEXT NOT NULL,
    "hint" TEXT,
    "question_number" INTEGER NOT NULL,
    "student_answer" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "correct_answer" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sample_answer" TEXT,
    "isCorrect" BOOLEAN,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,

    CONSTRAINT "BotChatQuestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotChatQuestions" ADD CONSTRAINT "BotChatQuestions_botChatId_fkey" FOREIGN KEY ("botChatId") REFERENCES "BotChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
