-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSubmitted" BOOLEAN NOT NULL DEFAULT false;
