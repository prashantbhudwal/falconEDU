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
