//TODO User any other technique to limit access to pages that doesn't involve using root layout

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { getUser } from "./api/db/user/[email]/route";
import LandingPage from "./Landing";
import UpgradeBtn from "../components/UpgradeBtn";
import Plans from "./(user)/pricing/Plans";
import { getProducts } from "@/lib/stripe";

// export const dynamic = `force-dynamic`;
export const revalidate = 6000;

function hasSubscriptionEnded(subscriptionEndDate: any): boolean {
  // Get current date/time
  const currentDate = new Date();

  // Convert subscriptionEndDate to a Date object
  const subscriptionEnd = new Date(subscriptionEndDate);

  // Check if the current date is after the subscription end date
  return currentDate > subscriptionEnd;
}

export default async function Expired({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!session) {
    return <LandingPage />;
  }
  const products = await getProducts();
  const userData = await getUser(email);
  const subscriptionEnded = hasSubscriptionEnded(userData?.subscriptionEnd);
  return (
    <>
      {!subscriptionEnded ? (
        children
      ) : (
        <div className="flex min-h-screen flex-col items-center pt-2 text-center bg-base-300 w-full">
          <h1 className="my-2 max-w-xl text-2xl leading-10 text-slate-300">
            Subscription expired. Please subscribe.
          </h1>
          <Plans products={products.data} />
          <p className="text-sm"></p>
        </div>
      )}
    </>
  );
}
