import { getChats } from "@/app/(falcon)/chubbi/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import BotList from "./components/bot-list";
import { bots } from "@/app/dragon/test-data";

const basePath = "/dragon/bots";

export default async function AllChats() {
  return (
    <>
      <BotList bots={bots} basePath={basePath} />
    </>
  );
}
