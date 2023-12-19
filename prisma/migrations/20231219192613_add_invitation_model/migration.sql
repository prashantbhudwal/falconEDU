-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Invitation" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL,
    "daysUntilExpiry" INTEGER DEFAULT 365,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_studentEmail_key" ON "Invitation"("studentEmail");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
