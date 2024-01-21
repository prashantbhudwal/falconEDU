export type ideaType =
  | "story"
  | "example"
  | "analogy"
  | "history"
  | "application"
  | "antiExample"
  | "contrast"
  | "definition"
  | "activity"
  | "quiz"
  | "features"
  | "glossary"
  | "";

export type aidType =
  | "lesson"
  | "outline"
  | "slides"
  | "blackboard"
  | "shortVideoScript"
  | "";
export type handoutType = "story" | "activity" | "quiz" | "";

export type worksheetAidType = "worksheet" | "answerKey" | "support";

export function validateIdeaType(prompt: string): ideaType | null {
  const validIdeaTypes: ideaType[] = [
    "story",
    "example",
    "analogy",
    "history",
    "application",
    "antiExample",
    "contrast",
    "definition",
    "activity",
    "quiz",
    "features",
    "glossary",
    "",
  ];

  if (!validIdeaTypes.includes(prompt as ideaType)) {
    console.error("Invalid ideaType:", prompt);
    return null;
  }

  return prompt as ideaType;
}
