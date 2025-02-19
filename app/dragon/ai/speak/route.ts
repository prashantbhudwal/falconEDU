import { trackEvent } from "@/lib/mixpanel";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OPENAI_MODEL } from "../config";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
const openai = new OpenAI();

const voice = "alloy";
const speed = 0.9;
export async function POST(req: Request, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const email = session.user.email as string;
  const body = await req.json();
  try {
    const text = body.text;
    const { attemptId, taskId, type } = body;

    trackEvent("student", "textToSpeech_used", {
      distinct_id: email,
      model: OPENAI_MODEL.SPEECH,
      task_type: type,
      task_id: taskId,
      attempt_id: attemptId,
      voice,
      speed,
    });

    const mp3 = await openai.audio.speech.create({
      model: OPENAI_MODEL.SPEECH,
      voice: voice,
      input: text,
      speed: speed,
    });

    // Convert to buffer
    const buffer = await mp3.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error(error);
  }
}
