import Stripe from "stripe";
import { cache } from "react";
import { headers } from "next/headers";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export type GetPricesReturnType = Stripe.ApiList<Stripe.Price>;

export const getPrices = cache(async () => {
  const prices = await stripe.prices.list();
  return prices;
});

export const checkout = async () => {
  const headersList = headers();

  const origin = headersList.get("origin");

  await stripe.checkout.sessions.create({
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
  });
};
