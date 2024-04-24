import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { AI } from ".";
import { spinner } from "../rsc/spinner";
import { sleep } from "./submit";
import { SystemMessage } from "../rsc/system-message";
import { nanoid } from "nanoid";
export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>,
) => {
  fn();
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export async function confirmPurchase(
  symbol: string,
  price: number,
  amount: number,
) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>,
  );

  const systemMessage = createStreamableUI(null);

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000);

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>,
    );

    await sleep(1000);

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{" "}
          {formatNumber(amount * price)}
        </p>
      </div>,
    );

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={" "}
        {formatNumber(amount * price)}.
      </SystemMessage>,
    );

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: "function",
          name: "showStockPurchase",
          content: JSON.stringify({
            symbol,
            price,
            defaultAmount: amount,
            status: "completed",
          }),
        },
        {
          id: nanoid(),
          role: "system",
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`,
        },
      ],
    });
  });

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  };
}
