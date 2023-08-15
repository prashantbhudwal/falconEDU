import { nanoid } from "@/utils";
import { Chat } from "../components/chat";

export default function IndexPage() {
  const id = nanoid();

  return <Chat id={id} />;
}
