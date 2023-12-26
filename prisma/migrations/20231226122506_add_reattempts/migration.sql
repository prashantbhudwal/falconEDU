-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "canReAttempt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxAttempts" INTEGER DEFAULT 0;
