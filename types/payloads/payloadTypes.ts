import { BlockContent } from "../block";

export type StreamPayload = {
  topic: string;
  subtopic: string;
  grade: string;
  ideaArray: BlockContent[];
};
