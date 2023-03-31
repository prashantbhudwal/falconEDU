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

export const blockContentArray = [
  {
    text: "This is a short description of a Pikachu.",
    id: "id-1",
    type: "Type 1",
    emoji: "🐹",
  },
  {
    text: "This is a short description of a Charmander.",
    id: "id-2",
    type: "Type 2",
    emoji: "🦎",
  },
  {
    text: "Squirtle is a water-type Pokémon with a hard shell and a playful personality. It loves to play in the water and can shoot powerful water jets from its mouth.",
    id: "id-3",
    type: "Type 3",
    emoji: "🐢",
  },
  {
    text: "This is a short description of a Bulbasaur.",
    id: "id-4",
    type: "Type 4",
    emoji: "🌱",
  },
  {
    text: "This is a short description of a Jigglypuff.",
    id: "id-5",
    type: "Type 5",
    emoji: "🎤",
  },
  {
    text: "This is a short description of a Eevee.",
    id: "id-6",
    type: "Type 6",
    emoji: "🦊",
  },
  {
    text: "This is a short description of a Snorlax.",
    id: "id-7",
    type: "Type 7",
    emoji: "💤",
  },
  {
    text: "This is a short description of a Pikachu.",
    id: "id-8",
    type: "Type 8",
    emoji: "🐭",
  },
  {
    text: "This is a short description of a Mewtwo.",
    id: "id-9",
    type: "Type 9",
    emoji: "🧬",
  },
  {
    text: "This is a short description of a Gyarados.",
    id: "id-10",
    type: "Type 10",
    emoji: "🐠",
  },
];
