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
      return "Oops!! AI is on Strike. Try Again?";
  }
};

export const getPrompt = function (promptType: string) {
  switch (promptType) {
    case "story":
      return "Tell me a story that helps students understand";
    case "example":
      return "Provide an example that clarifies the concept for students";
    case "analogy":
      return "Share an analogy that makes the concept easier for students to grasp";
    case "history":
      return "Discuss the historical context or background of";
    case "application":
      return "Describe a real-world application of this concept that students can relate to";
    case "antiExample":
      return "Explain a counterexample that helps students differentiate between correct and incorrect understanding of";
    case "contrast":
      return "Compare and contrast this concept with other closely related topics to help students distinguish between them";
    case "define":
      return "Define the concept in a clear and concise manner for students";
    default:
      return "Explain the concept in a way that is easy for students to understand";
  }
};
