export const getEmoji = function (blockType: string) {
  switch (blockType) {
    case "story":
      return "🏜";
    case "example":
      return "🧩";
    case "analogy":
      return "🪢";
    case "history":
      return "📜";
    case "application":
      return "🎯";
    case "antiExample":
      return "☣️";
    case "contrast":
      return "🔀";
    case "define":
      return "📝";
    default:
      return "☣️";
  }
};

export const getPrompt = function (promptType: string) {
  switch (promptType) {
    case "story":
      return "Tell me a story that helps me understand";
    case "example":
      return " Give me an example of";
    case "analogy":
      return "Give me an analogy that helps me understand";
    case "history":
      return "Tell me about the history of";
    case "application":
      return "Give me a real-world application of";
    case "antiExample":
      return "Give me a counter example of";
    case "contrast":
      return "Contrast the topic after ':' with other closely related topics";
    case "define":
      return "Define";
    default:
      return "Explain";
  }
};
