import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file") as any;

  try {
    // Transcription using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    return NextResponse.json({ transcription: transcription.text });
  } catch (e) {
    console.error("Error while trying to transcribe the file\n", e);
    return NextResponse.json(
      { error: "Something went wrong during transcription." },
      { status: 500 }
    );
  }
}
