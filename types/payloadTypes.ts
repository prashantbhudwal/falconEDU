import { BlockContent } from "./blockTypes";

export type StreamPayload = {
  topic: string;
  subtopic: string;
  grade: string;
  data: BlockContent[] | string[];
  payloadType: "lesson" | "outline";
};
