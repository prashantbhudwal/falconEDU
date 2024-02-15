-- CreateTable
CREATE TABLE "Source" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "teacherProfileId" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToSource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BotConfigToSource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToSource_AB_unique" ON "_ClassToSource"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToSource_B_index" ON "_ClassToSource"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BotConfigToSource_AB_unique" ON "_BotConfigToSource"("A", "B");

-- CreateIndex
CREATE INDEX "_BotConfigToSource_B_index" ON "_BotConfigToSource"("B");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "TeacherProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToSource" ADD CONSTRAINT "_ClassToSource_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToSource" ADD CONSTRAINT "_ClassToSource_B_fkey" FOREIGN KEY ("B") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BotConfigToSource" ADD CONSTRAINT "_BotConfigToSource_A_fkey" FOREIGN KEY ("A") REFERENCES "BotConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BotConfigToSource" ADD CONSTRAINT "_BotConfigToSource_B_fkey" FOREIGN KEY ("B") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
