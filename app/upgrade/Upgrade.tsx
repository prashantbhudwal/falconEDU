import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUser } from "../api/db/user/[email]/route";
import LandingPage from "../Landing";

export const revalidate = 3600; // revalidate every hour

function hasSubscriptionEnded(subscriptionEndDate: any): boolean {
  // Get current date/time
  const currentDate = new Date();

  // Convert subscriptionEndDate to a Date object
  const subscriptionEnd = new Date(subscriptionEndDate);

  // Check if the current date is after the subscription end date
  return currentDate > subscriptionEnd;
}

export default async function Upgrade({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!session) {
    return <LandingPage />;
  }

  const userData = await getUser(email);
  const subscriptionEnded = hasSubscriptionEnded(userData?.subscriptionEnd);

  return (
    <>
      {!subscriptionEnded ? (
        children
      ) : (
        <div className="flex flex-col items-center text-center pt-8 min-h-screen">
          <h1 className="my-6 text-2xl md:text-5xl text-slate-300 max-w-xl leading-10 lg:text-5xl">
            Subscription Expired.
          </h1>
          <p className={"mb-12 text-lg text-gray-500 md:text-xl max-w-xl mt-6"}>
            To subscribe, drop a WhatsApp message at +91 9833045490.
          </p>
        </div>
      )}
    </>
  );
}
