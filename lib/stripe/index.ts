import Stripe from "stripe";
import { cache } from "react";


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export const getProducts = cache(async () => {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });
  return products;
});



