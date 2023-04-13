export const getEmoji = function (blockType: string) {
  const loweCaseBlockType = blockType.toLowerCase();
  switch (loweCaseBlockType) {
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
    case "definition":
      return "📝";
    case "activity":
      return "🏄";
    case "quiz":
      return "🏆";
    case "lessonplan":
      return "🧑‍🏫";
    case "lessonoutline":
      return "🪄";
    case "slides":
      return "🎬 ";
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
    case "definition":
      return "Define the concept in a clear and concise manner for students";
    case "activity":
      return "Be creative and suggest one engaging and exciting small group activity that helps students understand";
    case "quiz":
      return "Make a MCQ quiz of 5 questions to assess the students on the topic of";
    default:
      return "Explain the concept in a way that is easy for students to understand";
  }
};

export const getBlockShadow = function (blockType: string) {
  switch (blockType) {
    case "story":
      return "shadow-green-600";
    case "example":
      return "shadow-amber-600";
    case "analogy":
      return "shadow-rose-600";
    case "history":
      return "shadow-indigo-600";
    case "application":
      return "shadow-cyan-600";
    case "antiExample":
      return "shadow-red-600";
    case "contrast":
      return "shadow-lime-600";
    case "definition":
      return "shadow-fuchsia-600";
    case "activity":
      return "shadow-blue-600";
    case "quiz":
      return "shadow-violet-600";
    default:
      return "shadow-none";
  }
};

export const buttonsArray = [
  "Definition",
  "Example",
  "Story",
  "Analogy",
  "History",
  "Application",
  // "Anti-Example",
  "Contrast",
  "Activity",
  "Quiz",
];

export const blockContentArray = [
  {
    text: "This is a short description of a Pikachu.",
    id: "id-1",
    type: "story",
    emoji: "🏜",
  },
  {
    text: "This is a short description of a Charmander.",
    id: "id-2",
    type: "example",
    emoji: "🧩",
  },
  {
    text: "Squirtle is a water-type Pokémon with a hard shell and a playful personality. It loves to play in the water and can shoot powerful water jets from its mouth.",
    id: "id-3",
    type: "analogy",
    emoji: "🪢",
  },
  {
    text: "This is a short description of a Bulbasaur.",
    id: "id-4",
    type: "history",
    emoji: "📜",
  },
  {
    text: "This is a short description of a Jigglypuff.",
    id: "id-5",
    type: "application",
    emoji: "🎯",
  },
  {
    text: "This is a short description of an Eevee.",
    id: "id-6",
    type: "antiExample",
    emoji: "☣️",
  },
  {
    text: "This is a short description of a Snorlax.",
    id: "id-7",
    type: "contrast",
    emoji: "🔀",
  },
  {
    text: "This is a short description of a Pikachu.",
    id: "id-8",
    type: "define",
    emoji: "📝",
  },
  {
    text: "This is a short description of a Mewtwo.",
    id: "id-9",
    type: "story",
    emoji: "🏜",
  },
  {
    text: "This is a short description of a Gyarados.",
    id: "id-10",
    type: "example",
    emoji: "🧩",
  },
];
