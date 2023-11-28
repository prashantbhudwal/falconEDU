import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/prisma";
import { getStudentId } from "@/app/dragon/student/queries";
import { getTeacherId } from "@/app/dragon/teacher/queries";
import { type } from "os";
type isAuthorizedParams = {
  userType: "STUDENT" | "TEACHER";
  chatId?: string;
  botChatId?: string;
  botId?: string;
};
export const isAuthorized = async ({
  userType,
  chatId,
  botChatId,
  botId,
}: isAuthorizedParams) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      error: "unauthorized",
    };
  }

  if (session.user.userType !== userType) {
    return {
      error: "unauthorized",
    };
  }

  if (session.user.userType == "STUDENT") {
    const studentId = await getStudentId(session.user.id);
    if (!studentId) {
      return {
        error: "unauthorized",
      };
    }
  } else if (session.user.userType == "TEACHER") {
    const teacherId = await getTeacherId(session.user.id);
    if (!teacherId) {
      return {
        error: "unauthorized",
      };
    }
  }
  return true;
};
