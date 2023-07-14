import { NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { email: string };
  }
) {
  const email = params.email;
  let user = await prisma.user.findUnique({
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
  console.log(user);
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
  const email = params.email;
  const body = await request.json();

  const { id, name, phone, headline } = body;

  try {
    const updatedTeacher = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: name,
        email: email,
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
