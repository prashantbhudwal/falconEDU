import { nanoid } from "nanoid";
import { SpinnerMessage } from "../../rsc/spinner-message";
import { getMutableAIState, render, createStreamableValue } from "ai/rsc";
import { BotMessage } from "../../rsc/bot-message";
import { z } from "zod";
import { BotCard } from "../../rsc/bot-card";
import { Skeleton } from "@/components/ui/skeleton";
import OpenAI from "openai";
import { AI } from "..";
import { systemPrompt } from "./system-prompt";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const ui = render({
    model: "gpt-3.5-turbo",
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
    functions: {
      listStocks: {
        description: "List three imaginary stocks that are trending.",
        parameters: z.object({
          stocks: z.array(
            z.object({
              symbol: z.string().describe("The symbol of the stock"),
              price: z.number().describe("The price of the stock"),
              delta: z.number().describe("The change in price of the stock"),
            }),
          ),
        }),
        render: async function* ({ stocks }) {
          yield (
            <BotCard>
              <Skeleton />
            </BotCard>
          );

          await sleep(1000);

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "listStocks",
                content: JSON.stringify(stocks),
              },
            ],
          });

          return <BotCard> {JSON.stringify(stocks)}</BotCard>;
        },
      },
      showStockPrice: {
        description:
          "Get the current stock price of a given stock or currency. Use this to show the price to the user.",
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              "The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.",
            ),
          price: z.number().describe("The price of the stock."),
          delta: z.number().describe("The change in price of the stock"),
        }),
        render: async function* ({ symbol, price, delta }) {
          yield (
            <BotCard>
              <Skeleton />
            </BotCard>
          );

          await sleep(1000);

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "showStockPrice",
                content: JSON.stringify({ symbol, price, delta }),
              },
            ],
          });

          return (
            <BotCard>
              {JSON.stringify({
                symbol,
                price,
                delta,
              })}
            </BotCard>
          );
        },
      },
    },
  });

  return {
    id: nanoid(),
    display: ui,
  };
}
