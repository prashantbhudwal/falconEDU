-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "hostedImageId" TEXT;

-- CreateTable
CREATE TABLE "HostedImage" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostedImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_hostedImageId_fkey" FOREIGN KEY ("hostedImageId") REFERENCES "HostedImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
