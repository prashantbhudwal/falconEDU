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
    case "explain":
      return "📝";
    default:
      return "☣️";
  }
};

export const getPrompt = function (promptType: string) {
  switch (promptType) {
    case "story":
      return "Tell me a story about";
    case "example":
      return " Give me an example of";
    case "analogy":
      return "Give me an analogy for";
    case "history":
      return "Tell me about the history of";
    case "application":
      return "Give me an application of";
    case "antiExample":
      return "Give me an anti-example of";
    case "contrast":
      return "Contrast";
    case "explain":
      return "Explain";
    default:
      return "Explain";
  }
};
