import { getServerSession } from "next-auth";
import { authOptions } from "../../app/(schools)/api/auth/[...nextauth]/authOptions";
import { getUser } from "@/app/(schools)/api/db/user/[email]/queries";
import Plans from "../../app/(schools)/(user)/pricing/plans";
import { getProducts } from "@/lib/stripe";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-btn";

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
    redirect("/");
  }
  const products = await getProducts();
  const userData = await getUser(email);
  const subscriptionEnded = hasSubscriptionEnded(userData?.subscriptionEnd);
  return (
    <>
      {!subscriptionEnded ? (
        children
      ) : (
        <div className="custom-scrollbar flex h-screen min-h-screen w-full flex-col items-center overflow-y-auto bg-base-300 pt-2 text-center">
          <h1 className="my-2 max-w-xl text-2xl leading-10 text-slate-300">
            Subscription expired. Please subscribe.
          </h1>
          <Plans products={products.data} />
          <p className="text-sm"></p>
          <SignOutButton className="btn-base-100 btn my-4 text-slate-500" />
        </div>
      )}
    </>
  );
}
