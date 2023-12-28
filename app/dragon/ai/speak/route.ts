import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();
export async function POST(req: Request, res: NextResponse) {
  const body = await req.json();
  try {
    const text = body.text;
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
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
