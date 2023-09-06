import { useChat, type Message } from "ai/react";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export default function Chat({ id, initialMessages }: ChatProps) {
  return (
    <div>
      Chat
      <>With me</>
    </div>
  );
}
