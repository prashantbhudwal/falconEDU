import { getChats } from "@/app/(falcon)/chubbi/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import BotList from "./components/bot-list";
import { bots } from "@/app/dragon/test-data";
import { getBotsByUserId } from "./queries";

const basePath = "/dragon/student";

export default async function AllChats() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) {
    return null;
  }
  const bots = await getBotsByUserId(id);
  if (!bots) {
    return (
      <>
        <h1>Oops...No bots found. Ask a teacher to assign you a bot.</h1>
      </>
    );
  }
  return (
    <>
      <BotList bots={bots} basePath={basePath} />
    </>
  );
}
