import { ideaType } from "./ideaTypes";
export type BlockContent = {
  text: string | string[];
  id: string;
  type: ideaType;
  emoji: string;
};
