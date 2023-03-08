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
