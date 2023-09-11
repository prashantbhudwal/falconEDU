import { getBots } from "../actions";
import BotPreview from "../components/bot-preview-card";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { NewBotCard } from "../components/new-bot-card";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const bots = await getBots(id);
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-wrap gap-4 w-11/12 py-6">
        <NewBotCard />
        {bots.map((bot) => (
          <BotPreview key={bot.id} data={bot} />
        ))}
        {bots.map((bot) => (
          <BotPreview key={bot.id} data={bot} />
        ))}
        {bots.map((bot) => (
          <BotPreview key={bot.id} data={bot} />
        ))}
      </div>
    </div>
  );
}
