import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { getUser } from "./api/db/user/[email]/route";
import LandingPage from "./Landing";
import SignOutButton from "./(falcon)/(merlin)/components/SignOutBtn";
import UpgradeBtn from "./(falcon)/(merlin)/components/UpgradeBtn";
import PlansGrid from "./(user)/pricing/PlansGrid";

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
        <div className="flex min-h-screen flex-col items-center pt-8 text-center">
          <h1 className="my-6 max-w-xl text-2xl leading-10 text-slate-300 md:text-5xl lg:text-5xl">
            Subscription Expired.
          </h1>
          <p className={"mb-12 mt-6 max-w-xl text-lg text-gray-500 md:text-xl"}>
            To subscribe, drop a WhatsApp message at +91 9833045490.
          </p>
          <div className="flex w-screen flex-col items-center gap-2">
            <PlansGrid />
            <SignOutButton className="btn btn-info" />
          </div>
        </div>
      )}
    </>
  );
}
