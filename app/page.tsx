import { chatArray, buttonsArray } from "@/app/schema";
import Chat from "./chat";

const chatResponse =
  "This is a simulation of chat response from the API route.";

export default function Home() {
  return (
    <Chat
      chatArray={chatArray}
      buttonsArray={buttonsArray}
      chatResponse={chatResponse}
    />
  );
}
