import Navbar from "@/components/navbar/navbar";
import Plans from "./plans";
import { cache } from "react";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { getProducts } from "@/lib/stripe";

export type GetPricesReturnType = Stripe.ApiList<Stripe.Price>;
export type GetProductsReturnType = Stripe.ApiList<Stripe.Product>;

export const revalidate = 3600; // revalidate the data at most every hour

export default async function Pricing() {
  const products = await getProducts();
  return (
    <div className="h-screen w-screen bg-base-300">
      <Navbar />
      <Plans products={products.data} />
    </div>
  );
}
