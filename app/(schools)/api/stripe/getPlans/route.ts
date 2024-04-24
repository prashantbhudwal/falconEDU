import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest, res: NextResponse) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
  });
  const prices = await stripe.prices.list();
  return NextResponse.json(prices);
}
