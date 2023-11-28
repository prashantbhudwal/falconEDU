import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { getFormattedDate } from "@/lib/utils";
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
    <div className="w-full mb-96 mt-5">
      <h1 className="text-2xl text-bold mb-3 mx-auto w-fit">Payment History</h1>
      <div className="flex flex-col px-6 w-full gap-3">
          {payments.map((payment, index) => (
            <div key={index} className="flex flex-row justify-between items-center w-full bg-base-100 rounded-2xl p-3">
              <div className="flex flex-col gap-2">
                <p className="capitalize">{payment.paymentMethod}</p>
                <p>
                  {getFormattedDate(payment.paymentDate.toLocaleDateString())}
                </p>
              </div>
                <p>
                  {payment.amount}
                </p>
            </div>
          ))}
      </div>
    </div>
  );
}
