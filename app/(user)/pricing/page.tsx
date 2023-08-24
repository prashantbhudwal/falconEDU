import Navbar from "@/app/(falcon)/(merlin)/components/Navbar";
import Plans from "./Plans";
import { cache } from "react";
import { stripe } from "@/utils/stripe";
import Stripe from "stripe";
import { getProducts } from "@/utils/stripe";

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
