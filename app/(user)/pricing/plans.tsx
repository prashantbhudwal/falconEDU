"use client";
import React, { useState } from "react";
import axios from "axios";
import Stripe from "stripe";
import Image from "next/image";

const features = [
  "CBSE Curriculum",
  "Unlimited Lessons",
  "Unlimited Worksheets",
  "Chubbi Chat",
  "Latest AI Models",
  "24x7 Support",
];

type PlansProps = {
  products: Stripe.Product[];
};

const checkout = async (priceId: string) => {
  const res = await axios.post("/api/stripe/checkout", {
    priceId,
  });
  window.location.assign(res.data);
};

const isStripePrice = (
  price: string | Stripe.Price | null | undefined
): price is Stripe.Price => {
  return (price as Stripe.Price).unit_amount !== undefined;
};

const getNumberOfMonths = (lookupKey: string) => {
  switch (lookupKey) {
    case "standard_monthly":
      return 1;
    case "standard_quarterly":
      return 3;
    case "standard_half_yearly":
      return 6;
    case "standard_yearly":
      return 12;
    default:
      return 1;
  }
};

const Plans: React.FC<PlansProps> = ({ products }) => {
  const [rangeValue, setRangeValue] = useState(2);

  // Filter products with Stripe.Price as default_price and active
  const validProducts = products
    .filter((product) => isStripePrice(product.default_price) && product.active)
    .map((product) => ({
      ...product,
      default_price: product.default_price as Stripe.Price,
    }));

  // Sort products by price in ascending order
  const sortedProducts = [...validProducts].sort((a, b) => {
    return (
      (a.default_price.unit_amount || 0) - (b.default_price.unit_amount || 0)
    );
  });

  const selectedProductIndex = rangeValue - 1;
  const selectedProduct = sortedProducts[selectedProductIndex];
  const price = selectedProduct?.default_price as Stripe.Price;

  const selectProduct = (value: string) => {
    setRangeValue(parseInt(value));
  };

  return (
    <section className="flex flex-col items-center justify-center gap-6">
      <div className="w-64 mt-8">
        <input
          type="range"
          min={1}
          max={sortedProducts.length}
          value={rangeValue}
          className="range range-accent"
          step="1"
          onChange={(e) => selectProduct(e.target.value)}
        />
        <div className="w-full flex justify-between text-sm px-2">
          {sortedProducts.map((product) => (
            <span key={product.id}>
              {product.default_price.lookup_key &&
                getNumberOfMonths(product.default_price.lookup_key)}
            </span>
          ))}
        </div>
      </div>
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="bg-base-200 px-32">
          <Image src="/chubbi.png" alt="Album" width={200} height={200} />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-accent">
            <span>
              {price.lookup_key && getNumberOfMonths(price.lookup_key)} Month
              {price.lookup_key && getNumberOfMonths(price.lookup_key) === 1
                ? ""
                : "s"}
            </span>
            <span className="text-accent">Pro </span>
          </h2>
          <div className="my-8 flex items-baseline">
            <span className="mr-2 text-5xl font-extrabold">
              <span className="text-3xl font-bold">₹</span>{" "}
              {price.unit_amount &&
                price.lookup_key &&
                Math.round(
                  price.unit_amount / 100 / getNumberOfMonths(price.lookup_key)
                )}
            </span>
            <span className="text-gray-500">per month</span>
          </div>
          <ul role="list" className="mb-8 space-y-4 text-left">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="card-actions justify-end">
            <button
              className="btn btn-accent btn-wide font-bold"
              onClick={() => checkout(price.id)}
            >
              Pay{" "}
              <span className="">
                ₹{price.unit_amount && price.unit_amount / 100}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Plans;
