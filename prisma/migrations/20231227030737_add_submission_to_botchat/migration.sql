-- AlterTable
ALTER TABLE "BotChat" ADD COLUMN     "isChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT;
