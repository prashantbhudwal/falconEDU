import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { Teacher } from "@prisma/client";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { email: string };
  }
) {
  const email = params.email;
  let user = await prisma.teacher.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      accountType: true,
    },
  });

  return NextResponse.json(user);
}
