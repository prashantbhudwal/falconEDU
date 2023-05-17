import { QuestionType } from "@/types";
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

export const getBlockShadow = function (ideaType: ideaType | QuestionType) {
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

export const getQuestionSectionShadow = function (questionType: QuestionType) {
  switch (questionType) {
    case "fillInTheBlanks":
      return "shadow-green-600";
    case "multipleChoiceSingleCorrect":
      return "shadow-amber-600";
    case "trueFalse":
      return "shadow-rose-600";
    case "shortAnswer":
      return "shadow-indigo-600";
    case "essay":
      return "shadow-cyan-600";
    case "longAnswer":
      return "shadow-red-600";
    case "matchTheFollowing":
      return "shadow-lime-600";
    case "multipleChoiceMultipleCorrect":
      return "shadow-fuchsia-600";
    case "oralTest":
      return "shadow-blue-600";
    case "project":
      return "shadow-violet-600";
    case "caseStudy":
      return "shadow-teal-600";
    case "debate":
      return "shadow-amber-500";
    case "brainstorming":
      return "shadow-indigo-500";
    case "groupDiscussion":
      return "shadow-cyan-500";
    case "workshop":
      return "shadow-red-500";
    case "symposium":
      return "shadow-blue-500";
    case "panelDiscussion":
      return "shadow-violet-500";
    default:
      return "shadow-none";
  }
};
export const getQuestionSectionTextColor = function (
  questionType: QuestionType
) {
  switch (questionType) {
    case "fillInTheBlanks":
      return "text-green-600";
    case "multipleChoiceSingleCorrect":
      return "text-amber-600";
    case "trueFalse":
      return "text-rose-600";
    case "shortAnswer":
      return "text-indigo-600";
    case "essay":
      return "text-cyan-600";
    case "longAnswer":
      return "text-red-600";
    case "matchTheFollowing":
      return "text-lime-600";
    case "multipleChoiceMultipleCorrect":
      return "text-fuchsia-600";
    case "oralTest":
      return "text-blue-600";
    case "project":
      return "text-violet-600";
    case "caseStudy":
      return "text-teal-600";
    case "debate":
      return "text-amber-500";
    case "brainstorming":
      return "text-indigo-500";
    case "groupDiscussion":
      return "text-cyan-500";
    case "workshop":
      return "text-red-500";
    case "symposium":
      return "text-blue-500";
    case "panelDiscussion":
      return "text-violet-500";
    default:
      return "text-none";
  }
};

export const getQuestionSectionBorderColor = function (
  questionType: QuestionType
) {
  switch (questionType) {
    case "fillInTheBlanks":
      return "border-green-600";
    case "multipleChoiceSingleCorrect":
      return "border-amber-600";
    case "trueFalse":
      return "border-rose-600";
    case "shortAnswer":
      return "border-indigo-600";
    case "essay":
      return "border-cyan-600";
    case "longAnswer":
      return "border-red-600";
    case "matchTheFollowing":
      return "border-lime-600";
    case "multipleChoiceMultipleCorrect":
      return "border-fuchsia-600";
    case "oralTest":
      return "border-blue-600";
    case "project":
      return "border-violet-600";
    case "caseStudy":
      return "border-teal-600";
    case "debate":
      return "border-amber-500";
    case "brainstorming":
      return "border-indigo-500";
    case "groupDiscussion":
      return "border-cyan-500";
    case "workshop":
      return "border-red-500";
    case "symposium":
      return "border-blue-500";
    case "panelDiscussion":
      return "border-violet-500";
    default:
      return "border-none";
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
