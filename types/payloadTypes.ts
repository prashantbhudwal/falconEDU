import { BlockContent } from "./blockTypes";
import { ideaType } from "./ideaTypes";
export type StreamPayload = {
  topic: string;
  subtopic: string;
  grade: string;
  data: BlockContent[] | string[];
  payloadType: "lesson" | "outline";
};

export type IdeaStreamPayload = {
  topic: string;
  subtopic: string;
  grade: string;
  promptType: ideaType;
};
