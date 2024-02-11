import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { trackEvent } from "@/lib/mixpanel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();
import { OPENAI_MODEL } from "../config";
import { TaskType } from "@/types";
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as any;
  const taskType = formData.get("taskType") as TaskType;
  const taskId = formData.get("taskId") as string;
  const attemptId = formData.get("attemptId") as string;
  trackEvent("student", "speechToText_used", {
    distinct_id: session.user.email as string,
    model: OPENAI_MODEL.WHISPER,
    task_type: taskType,
    task_id: taskId,
    attempt_id: attemptId,
  });

  try {
    // Transcription using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: OPENAI_MODEL.WHISPER,
    });

    return NextResponse.json({ transcription: transcription.text });
  } catch (e) {
    console.error("Error while trying to transcribe the file\n", e);
    return NextResponse.json(
      { error: "Something went wrong during transcription." },
      { status: 500 },
    );
  }
}
