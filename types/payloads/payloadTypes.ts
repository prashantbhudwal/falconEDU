import { BlockContent } from "../block";

export type StreamPayload = {
  topic: string;
  subtopic: string;
  grade: string;
  data: BlockContent[] | string[];
  payloadType: "lesson" | "outline";
};
