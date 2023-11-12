import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { getBotConfigs } from "../../../queries";

type TestDashboardProps = {
  params: {
    classId: string;
  };
};

export default async function NewTest({ params }: TestDashboardProps) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const botConfigs = await getBotConfigs(userId, classId, "test");

  return (
    <div className="w-full overflow-y-scroll custom-scrollbar ">
      <div className="p-10 h-full">New Test Page</div>
    </div>
  );
}
