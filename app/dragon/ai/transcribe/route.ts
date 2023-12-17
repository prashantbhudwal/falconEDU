import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  console.log("I ran");
  const formData = await request.formData();
  console.log(formData);

  const file = formData.get("file") as any;

  try {
    // Initialize OpenAI client
    const openai = new OpenAI();

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
