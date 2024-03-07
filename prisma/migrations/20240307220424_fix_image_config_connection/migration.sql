/*
  Warnings:

  - A unique constraint covering the columns `[hostedImageId]` on the table `BotConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BotConfig_hostedImageId_key" ON "BotConfig"("hostedImageId");
