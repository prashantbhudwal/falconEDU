import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cache } from "react";
import { headers } from "next/headers";
import { stripe } from "@/utils/stripe";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  const user = authSession?.user;
  const id = user?.id;
  const email = user?.email;
  if (!id || !email) {
    return NextResponse.json(new Error("User not found"));
  }

  const headersList = headers();

  const origin = headersList.get("origin");
  console.log(origin);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1NghqwSGZ8EG0JcbKMMqNuRD",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/success`,
    cancel_url: `${origin}/canceled`,
    payment_intent_data: {
      metadata: {
        userId: id,
        gmail: email,
      },
    },
  });
  return NextResponse.json(session.url);
}
