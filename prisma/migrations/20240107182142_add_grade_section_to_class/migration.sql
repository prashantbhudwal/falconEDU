-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10');

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "grade" "Grade" NOT NULL DEFAULT 'GRADE_5',
ADD COLUMN     "section" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
