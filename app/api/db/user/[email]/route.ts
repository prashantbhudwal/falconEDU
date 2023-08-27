import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const getUser = function (email: any) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      plan: true,
      subscriptionStart: true,
      subscriptionEnd: true,
      teacherProfile: {
        select: {
          bio: true,
        },
      },
    },
  });
};

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { email: string };
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect("/");
  }
  const email = params.email;
  let user = await getUser(email);
  return NextResponse.json(user);
}

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { email: string };
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect("/");
  }
  const email = params.email;
  const body = await request.json();

  const { id, name, phone, headline } = body;

  try {
    const updatedTeacher = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        teacherProfile: {
          upsert: {
            create: {
              bio: headline,
            },
            update: {
              bio: headline,
            },
          },
        },
      },
    });

    return NextResponse.json(updatedTeacher, { status: 200 });
  } catch (error) {
    console.error("Error updating teacher's profile:", error);
    return NextResponse.json(
      {
        error: `Unable to update teacher's profile: ${error}`,
      },
      { status: 500 }
    );
  }
}
