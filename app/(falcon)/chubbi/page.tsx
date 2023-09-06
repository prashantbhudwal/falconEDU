import { nanoid } from "@/lib";
import { Chat } from "../../../components/chat/chat";

export default function IndexPage() {
  const id = nanoid();

  return <Chat id={id} />;
}
