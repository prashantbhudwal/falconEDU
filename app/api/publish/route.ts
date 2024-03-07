import { NextResponse } from "next/server";
import { db } from "@/lib/routers";
import { TaskType } from "@/types";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    classId: string;
    botConfigId: string;
    type: TaskType;
  };
  const { success, updatedBotConfig, message } =
    await db.botConfig.publish(body);

  console.log({ success, updatedBotConfig });
  revalidatePath("/dragon/teacher/class");

  try {
    return Response.json({ success, updatedBotConfig, message });
  } catch (e) {
    console.log(e);
    return new NextResponse("Failed", { status: 500 });
  }
}
