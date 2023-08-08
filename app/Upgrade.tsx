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
        <div className="flex flex-col items-center text-center pt-8 min-h-screen">
          <h1 className="my-6 text-2xl md:text-5xl text-slate-300 max-w-xl leading-10 lg:text-5xl">
            Subscription Expired.
          </h1>
          <p className={"mb-12 text-lg text-gray-500 md:text-xl max-w-xl mt-6"}>
            To subscribe, drop a WhatsApp message at +91 9833045490.
          </p>
          <div className="flex flex-col gap-2 items-center w-screen">
            <PlansGrid />
            <SignOutButton className="btn btn-info" />
          </div>
        </div>
      )}
    </>
  );
}
