-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_botShareId_fkey";

-- AlterTable
ALTER TABLE "Bot" ALTER COLUMN "botShareId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_botShareId_fkey" FOREIGN KEY ("botShareId") REFERENCES "BotShare"("id") ON DELETE SET NULL ON UPDATE CASCADE;
