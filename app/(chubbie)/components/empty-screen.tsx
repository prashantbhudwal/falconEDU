import { UseChatHelpers } from "ai/react";
export function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-sm p-8">
        <h1 className="mb-2 text-lg font-semibold">Hello I am Chubbi!</h1>
      </div>
    </div>
  );
}
