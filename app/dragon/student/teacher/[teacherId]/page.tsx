import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { ItemCard } from "../../components/item-card";
import Link from "next/link";
import { getStudentBotChatURL, getStudentBotURL } from "@/lib/urls";
import { AvatarNavbar } from "../../components/student-navbar";
import { Separator } from "@/components/ui/separator";
import prisma from "@/prisma";
import { cache } from "react";
import { UnwrapPromise, getChatsByBotId } from "../../queries";

function getBotDescription(type: string) {
  switch (type) {
    case "chat":
      return "Chatbot";
    case "test":
      return "Test";
    default:
      return "Others";
  }
}
const getBotsByTeacherAndStudentID = cache(async function (
  teacherId: string,
  userId: string
) {
  // Fetch studentId from StudentProfile using userId
  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });

  // If no matching student profile, return an empty array or handle as needed
  if (!studentProfile) return [];

  const studentId = studentProfile.id;

  // Fetch bots filtered by teacherId and studentId
  const bots = await prisma.bot.findMany({
    where: {
      BotConfig: {
        teacherId: teacherId,
      },
      studentId: studentId,
    },
    select: {
      id: true,
      isSubmitted: true,
      createdAt: true,
      BotConfig: {
        select: {
          name: true,
          type: true,
          teacher: {
            select: {
              User: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return bots;
});

export type getBotsByTeacherAndStudentID = UnwrapPromise<
  ReturnType<typeof getBotsByTeacherAndStudentID>
>;

const getTeacherDetailsByTeacherId = cache(async function (teacherId: string) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    select: {
      User: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return teacher;
});

export default async function TeacherDashboard({
  params,
}: {
  params: { teacherId: string };
}) {
  const { teacherId } = params;
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) {
    return null;
  }
  const bots = await getBotsByTeacherAndStudentID(teacherId, id);
  const teacher = await getTeacherDetailsByTeacherId(teacherId);
  if (!bots) {
    return (
      <>
        <h1>Oops...No bots found. Ask a teacher to assign you a bot.</h1>
      </>
    );
  }
  //sort in descending order of createdAt
  const unSubmittedBots = bots
    .filter((bot) => !bot.isSubmitted)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const submittedBots = bots
    .filter((bot) => bot.isSubmitted)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // ------------------------url to take the user to directly chat------------------------------------//
  const getDefaultStudentChatUrl = async (botId: string) => {
    const chats = await getChatsByBotId(botId);

    if (!chats) {
      return null;
    }

    const defaultChat = chats.find((chat) => chat.isDefault);

    if (defaultChat) {
      return getStudentBotChatURL(defaultChat.bot.id, defaultChat.id);
    }
    return null;
  };

  return (
    <div>
      <AvatarNavbar
        title={teacher?.User.name!}
        subtitle={teacher?.User.email!}
        avatarUrl={teacher?.User.image!}
      />
      <div className="pt-1 pb-20 w-full overflow-y-auto h-screen custom-scrollbar">
        {unSubmittedBots.map(async (bot) => {
          const defaultChatUrl = await getDefaultStudentChatUrl(bot.id);
          const multipleChatUrl = getStudentBotURL(bot.id);
          return (
            <Link href={defaultChatUrl || multipleChatUrl} key={bot.id}>
              <ItemCard
                title={bot.BotConfig.name!}
                description={getBotDescription(bot.BotConfig.type!)}
              />
            </Link>
          );
        })}
        {submittedBots.length > 0 && (
          <>
            <h1 className="px-4 my-2 font-semibold">Submitted</h1>
            <Separator className="my-2" />
            {submittedBots.map(async (bot) => {
              const defaultChatUrl = await getDefaultStudentChatUrl(bot.id);
              const multipleChatUrl = getStudentBotURL(bot.id);
              return (
                <Link href={defaultChatUrl || multipleChatUrl} key={bot.id}>
                  <ItemCard
                    title={bot.BotConfig.name!}
                    description={getBotDescription(bot.BotConfig.type!)}
                  />
                </Link>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
