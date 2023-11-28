import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

type TestDashboardProps = {
  params: {
    classId: string;
  };
};

export default async function NewTest({ params }: TestDashboardProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  return (
    <div className="w-full overflow-y-scroll custom-scrollbar ">
      <div className="p-10 h-full">New Test Page</div>
    </div>
  );
}
