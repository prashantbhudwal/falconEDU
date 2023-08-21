import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const buf = await req.text();
  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }

  console.log(event);
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      console.log("data", paymentIntentSucceeded.metadata);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
