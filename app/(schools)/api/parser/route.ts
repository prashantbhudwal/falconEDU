import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { parseFileToString } from "./parser";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const formData = await request.formData();
  try {
    const file = formData.get("file") as File;
    const result = await parseFileToString(file);
    return new NextResponse(result, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.log("error", error);
  }
}
