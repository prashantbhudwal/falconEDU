import { Button } from "../ui/button";
import { UseChatHelpers } from "ai/react/dist";
import { CreateMessage } from "ai";

const suggestions: Array<{
  keyword: string;
  suggestion: string;
  prompt: CreateMessage;
}> = [
  {
    keyword: "next",
    suggestion: "What's next?",
    prompt: {
      role: "user",
      content: "What's next?",
    },
  },
  {
    keyword: "example",
    suggestion: "Give me an example of this",
    prompt: {
      role: "user",
      content: "Can you give me an example?",
    },
  },
  {
    keyword: "confused",
    suggestion: "I am confused",
    prompt: {
      role: "user",
      content: "I am confused about this, can you help me?",
    },
  },
  {
    keyword: "story",
    suggestion: "Tell me a story",
    prompt: {
      role: "user",
      content: "Can you tell me a story to explain this?",
    },
  },
];

export function ChatSuggestions({
  append,
}: {
  append: UseChatHelpers["append"];
}) {
  const onClick = async (suggestion: CreateMessage) => {
    await append(suggestion);
  };

  return (
    <div className="scrollbar-hide flex flex-row space-x-3 overflow-x-auto pl-3">
      {suggestions.map((suggestion) => (
        <Button
          onClick={() => onClick(suggestion.prompt)}
          key={suggestion.keyword}
          variant={"outline"}
          size={"sm"}
          className="w-fit whitespace-nowrap rounded-2xl border-accent/50 bg-base-300 text-xs hover:bg-base-300 hover:text-inherit active:bg-base-300 active:text-inherit"
        >
          {suggestion.suggestion}
        </Button>
      ))}
    </div>
  );
}
