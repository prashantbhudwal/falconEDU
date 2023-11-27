import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";
export const dynamic = "force-dynamic";
import { predictChapters, predictTopics } from ".";

export async function POST(request: NextRequest) {
  const { predictionType, data } = await request.json();
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

    return new NextResponse(JSON.stringify(topics));
  }
}
