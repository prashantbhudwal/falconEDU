-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "learningObjectives" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];
