import { NextResponse, NextRequest } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Hello World" });
}
