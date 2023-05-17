import { ideaType } from "@/types/ideaTypes";
import { aidType } from "@/types/ideaTypes";
import { worksheetAidType } from "@/types/ideaTypes";

export const getEmoji = function (
  ideaType: ideaType | aidType | worksheetAidType
) {
  const loweCaseBlockType = ideaType.toLowerCase();
  switch (loweCaseBlockType) {
    case "story":
      return "📖";
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
    case "lesson":
      return "👩‍🏫";
    case "outline":
      return "📋";
    case "slides":
      return "🎬";
    case "blackboard":
      return "⬛️";
    case "shortvideoscript":
      return "🎬";
    case "worksheet":
      return "📝";
    case "answer key":
      return "🔑";
    case "support":
      return "👩‍🏫";
    default:
      return "Oops!! AI is on Strike. Try Again?";
  }
};

export const getName = function (
  ideaType: ideaType | aidType | worksheetAidType
) {
  const loweCaseBlockType = ideaType.toLowerCase();
  switch (loweCaseBlockType) {
    case "story":
      return "Story";
    case "example":
      return "Example";
    case "analogy":
      return "Analogy";
    case "history":
      return "History";
    case "application":
      return "Application";
    case "antiExample":
      return "Anti-Example";
    case "contrast":
      return "Contrast";
    case "definition":
      return "Definition";
    case "activity":
      return "Activity";
    case "quiz":
      return "Quiz";
    case "lesson":
      return "Lesson";
    case "outline":
      return "Summary";
    case "slides":
      return "Slides";
    case "blackboard":
      return "Blackboard";
    case "shortvideoscript":
      return "Video Script";
    case "worksheet":
      return "Worksheet";
    case "answer key":
      return "Answer Key";
    case "support":
      return "Support";
    default:
      return "Oops!! AI is on Strike. Try Again?";
  }
};

export const getBlockShadow = function (ideaType: ideaType) {
  switch (ideaType) {
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

export const buttonsArray: ideaType[] = [
  "definition",
  "example",
  "story",
  "analogy",
  "history",
  "application",
  // "Anti-Example",
  "contrast",
  "activity",
  "quiz",
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
