import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getEditBotURL } from "@/lib/urls";
import { getFormattedDate } from "@/lib/utils";
import { ItemCardChip, ItemCard } from "../../../components/item-card";
import AddTestForm from "./add-test-form";
import { getBotConfigs } from "../../../queries";

type TestDashboardProps = {
  params: {
    classId: string;
  };
};

export default async function TestDashboard({ params }: TestDashboardProps) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const botConfigs = await getBotConfigs(userId, classId, "test");
  return (
    <div className="w-full">
      <div className="flex space-y-5 flex-col w-full">
        <AddTestForm classId={classId} />
        {botConfigs.map((bot) => (
          <Link href={getEditBotURL(classId, bot.id)} key={bot.id}>
            <ItemCard title={bot.name}>
              <div className="flex flex-row space-x-4">
                <ItemCardChip
                  label="Created"
                  value={getFormattedDate(bot.createdAt.toDateString())}
                />
                <ItemCardChip
                  label="Status"
                  value={bot.published ? "Published" : "Not Published"}
                  valueColor={
                    bot.published ? "text-primary" : "text-destructive"
                  }
                />
              </div>
            </ItemCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
