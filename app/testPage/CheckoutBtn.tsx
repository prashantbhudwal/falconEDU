"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
import axios from "axios";

const checkout = async () => {
  const res = await axios.post("/api/stripe/checkout", {
    priceId: "testPrice",
  });
  console.log(res.data);
  window.location.assign(res.data);
};

export default function CheckoutBtn() {
  return (
    <button className="bg-zinc-200 p-2" onClick={() => checkout()}>
      Buy now
    </button>
  );
}
