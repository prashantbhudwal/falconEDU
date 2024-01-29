-- CreateEnum
CREATE TYPE "CognitiveLevel" AS ENUM ('knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation');

-- CreateEnum
CREATE TYPE "GoalAssessmentResult" AS ENUM ('a', 'b', 'c', 'd', 'f');

-- CreateTable
CREATE TABLE "LearningGoals" (
    "id" TEXT NOT NULL,
    "botConfigId" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "cognitiveLevel" "CognitiveLevel" NOT NULL,
    "assessmentMethod" "QuestionType"[] DEFAULT ARRAY[]::"QuestionType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalAssessment" (
    "id" TEXT NOT NULL,
    "botChatId" TEXT NOT NULL,
    "learningGoalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" "GoalAssessmentResult" NOT NULL,
    "resultDesc" TEXT NOT NULL,

    CONSTRAINT "GoalAssessment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LearningGoals" ADD CONSTRAINT "LearningGoals_botConfigId_fkey" FOREIGN KEY ("botConfigId") REFERENCES "BotConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalAssessment" ADD CONSTRAINT "GoalAssessment_botChatId_fkey" FOREIGN KEY ("botChatId") REFERENCES "BotChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalAssessment" ADD CONSTRAINT "GoalAssessment_learningGoalId_fkey" FOREIGN KEY ("learningGoalId") REFERENCES "LearningGoals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
