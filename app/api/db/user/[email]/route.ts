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
  console.log("email", email);
  let user = await prisma.teacher.findUnique({
    where: {
      email: email,
    },
  });

  return NextResponse.json(user);
}
