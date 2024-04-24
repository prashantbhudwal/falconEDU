import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function PaymentsTable() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!session) {
    return <div>Not logged in</div>;
  }
  const payments = await prisma.payment.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });
  if (!payments) {
    return null;
  }

  return (
    <div className="mb-96 mt-5 w-full">
      <h1 className="text-bold mx-auto mb-3 w-fit text-2xl">Payment History</h1>
      <div className="flex w-full flex-col gap-3 px-6">
        {payments.map((payment, index) => (
          <div
            key={index}
            className="flex w-full flex-row items-center justify-between rounded-2xl bg-base-100 p-3"
          >
            <div className="flex flex-col gap-2">
              <p className="capitalize">{payment.paymentMethod}</p>
              <p>{formatDate(payment.paymentDate)}</p>
            </div>
            <p>{payment.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
