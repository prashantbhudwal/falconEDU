import { BotCard } from "./rsc/bot-card";
import { BotMessage } from "./rsc/bot-message";
import { UserMessage } from "./rsc/user-message";
import { Chat } from "./types";

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "function" ? (
          message.name === "listStocks" ? (
            <BotCard>
              <Test json={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === "showStockPrice" ? (
            <BotCard>
              <Test json={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === "showStockPurchase" ? (
            <BotCard>
              <Test json={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === "getEvents" ? (
            <BotCard>
              <Test json={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === "user" ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        ),
    }));
};

const Test = ({ json }: { json: JSON }) => {
  return <div>{JSON.stringify(json)}</div>;
};
