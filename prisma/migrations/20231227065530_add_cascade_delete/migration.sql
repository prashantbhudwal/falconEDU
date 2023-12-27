-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_botConfigId_fkey";

-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_studentId_fkey";

-- DropForeignKey
ALTER TABLE "BotChat" DROP CONSTRAINT "BotChat_botId_fkey";

-- DropForeignKey
ALTER TABLE "BotChatQuestions" DROP CONSTRAINT "BotChatQuestions_botChatId_fkey";

-- DropForeignKey
ALTER TABLE "BotChatQuestions" DROP CONSTRAINT "BotChatQuestions_parsedQuestionsId_fkey";

-- DropForeignKey
ALTER TABLE "BotConfig" DROP CONSTRAINT "BotConfig_classId_fkey";

-- DropForeignKey
ALTER TABLE "BotConfig" DROP CONSTRAINT "BotConfig_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "OrgAdminProfile" DROP CONSTRAINT "OrgAdminProfile_orgId_fkey";

-- DropForeignKey
ALTER TABLE "OrgAdminProfile" DROP CONSTRAINT "OrgAdminProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "ParentProfile" DROP CONSTRAINT "ParentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherProfile" DROP CONSTRAINT "TeacherProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "parsedQuestions" DROP CONSTRAINT "parsedQuestions_botConfigId_fkey";

-- AddForeignKey
ALTER TABLE "ParentProfile" ADD CONSTRAINT "ParentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgAdminProfile" ADD CONSTRAINT "OrgAdminProfile_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgAdminProfile" ADD CONSTRAINT "OrgAdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parsedQuestions" ADD CONSTRAINT "parsedQuestions_botConfigId_fkey" FOREIGN KEY ("botConfigId") REFERENCES "BotConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_botConfigId_fkey" FOREIGN KEY ("botConfigId") REFERENCES "BotConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChat" ADD CONSTRAINT "BotChat_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChatQuestions" ADD CONSTRAINT "BotChatQuestions_botChatId_fkey" FOREIGN KEY ("botChatId") REFERENCES "BotChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChatQuestions" ADD CONSTRAINT "BotChatQuestions_parsedQuestionsId_fkey" FOREIGN KEY ("parsedQuestionsId") REFERENCES "parsedQuestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
