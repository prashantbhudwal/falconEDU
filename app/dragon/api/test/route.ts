import { NextRequest, NextResponse } from "next/server";
import { test } from "../chat/messages";
export async function GET(req: NextRequest) {
  const chatPrompt = await test();
  return NextResponse.json({ chatPrompt });
}
