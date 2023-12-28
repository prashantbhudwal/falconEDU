-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "hasTimeLimit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeLimit" INTEGER DEFAULT 0;
