import BotCard from "./bot-card";
type BotListProps = {
  bots: any[];
  basePath: string;
};

export default function BotList({ bots, basePath }: BotListProps) {
  return (
    <>
      {bots.map((bot) => (
        <BotCard key={bot.id} bot={bot} href={`${basePath}/chat/${bot.id}`} />
      ))}
    </>
  );
}
