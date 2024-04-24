import { nanoid } from "nanoid";
import { AI } from "./chat/actions";
import { Chat } from "./chat/chat";

const Page = () => {
  const id = nanoid();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} />
    </AI>
  );
};

export default Page;
