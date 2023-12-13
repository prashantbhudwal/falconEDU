-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "parsedQuestions" ADD COLUMN     "isPossiblyWrong" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPossiblyWrongDesc" TEXT NOT NULL DEFAULT '';
