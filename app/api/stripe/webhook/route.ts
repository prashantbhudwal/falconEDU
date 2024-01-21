import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/prisma";
//Todo extract all payment configs to one file
const ONE_MONTH_PRICE = 400;
const THREE_MONTHS_PRICE = 800;
const SIX_MONTHS_PRICE = 1500;
const ONE_YEAR_PRICE = 2500;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const buf = await req.text();
  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret)
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 },
      );
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntentSucceeded.metadata.userId;
      const paymentAmount = paymentIntentSucceeded.amount / 100;
      const stripePaymentId = paymentIntentSucceeded.id;

      // Check if payment already processed
      const existingPayment = await prisma.payment.findUnique({
        where: { stripePaymentId: stripePaymentId },
      });
      if (existingPayment) {
        break;
      }

      // Create or Update Payment Record
      await prisma.payment.create({
        data: {
          userId: userId,
          stripePaymentId: paymentIntentSucceeded.id,
          status: paymentIntentSucceeded.status,
          paymentMethod: paymentIntentSucceeded.payment_method_types[0],
          amount: paymentAmount,
          paymentDate: new Date(paymentIntentSucceeded.created * 1000), // Convert Unix timestamp to JS Date
          currency: paymentIntentSucceeded.currency,
          // other fields as needed
        },
      });

      let subscriptionDuration = 0;

      if (paymentAmount === ONE_MONTH_PRICE) {
        subscriptionDuration = 30;
      } else if (paymentAmount === THREE_MONTHS_PRICE) {
        subscriptionDuration = 90;
      } else if (paymentAmount === SIX_MONTHS_PRICE) {
        subscriptionDuration = 180;
      } else if (paymentAmount === ONE_YEAR_PRICE) {
        subscriptionDuration = 365;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");
      const existingSubscriptionEndDate = user.subscriptionEnd || new Date();
      const newSubscriptionEndDate = new Date(existingSubscriptionEndDate);
      newSubscriptionEndDate.setDate(
        existingSubscriptionEndDate.getDate() + subscriptionDuration,
      );

      await prisma.user.update({
        where: { id: userId },
        data: {
          role: "PRO",
          subscriptionEnd: newSubscriptionEndDate,
        },
      });

      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
