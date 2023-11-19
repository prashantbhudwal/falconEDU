-- AlterTable
ALTER TABLE "parsedQuestions" ADD COLUMN     "options" TEXT[] DEFAULT ARRAY[]::TEXT[];
