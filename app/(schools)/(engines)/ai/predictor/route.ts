import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";
export const dynamic = "force-dynamic";
import { predictChapters, predictTopics } from ".";

export async function POST(request: NextRequest, response: NextResponse) {
  const { predictionType, data } = await request.json();
  try {
    if (predictionType === "predictChapters") {
      const {
        subject,
        board,
        grade,
      }: {
        subject: string;
        board: string;
        grade: string;
      } = data;

      const chapters = await predictChapters({ subject, board, grade });

      if (chapters.length === 0) {
        throw new Error("Prediction Failed");
      }

      return new NextResponse(JSON.stringify(chapters));
    }
    if (predictionType === "predictTopics") {
      const {
        subject,
        board,
        grade,
        chapter,
      }: {
        subject: string;
        board: string;
        grade: string;
        chapter: string;
      } = data;

      const topics = await predictTopics({ subject, board, grade, chapter });

      if (topics.length === 0) {
        throw new Error("Prediction Failed");
      }

      return new NextResponse(JSON.stringify(topics));
    }
  } catch (err: any) {
    console.error(err);
    //return an error that can be handled by the client
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
