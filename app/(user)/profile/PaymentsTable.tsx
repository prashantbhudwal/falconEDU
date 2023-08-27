import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
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
    <div className="overflow-x-auto w-full pb-10 ">
      <h1 className="text-3xl text-bold mb-6">Payment History</h1>
      <table className="table table-zebra table-md w-full bg-base-100 shadow shadow-base-100 rounded-sm">
        <thead>
          <tr>
            <th>Payment Date</th>
            <th>Payment Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>
                {getFormattedDate(payment.paymentDate.toLocaleDateString())}
              </td>
              <td className="capitalize">{payment.paymentMethod}</td>
              <td>{payment.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
