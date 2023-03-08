import { chatArray, buttonsArray } from "@/app/schema";
import Chat from "./chat";

export default function Home() {
  return <Chat chatArray={chatArray} buttonsArray={buttonsArray} />;
}
