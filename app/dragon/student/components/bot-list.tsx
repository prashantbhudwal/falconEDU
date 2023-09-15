import BotCard from "./bot-card";
import type { BotsByUserId } from "../queries";
type BotListProps = {
  bots: BotsByUserId;
  basePath: string;
};

export default function BotList({ bots, basePath }: BotListProps) {
  return (
    <>
      {bots.map((bot) => (
        <BotCard key={bot.id} bot={bot} />
      ))}
    </>
  );
}
