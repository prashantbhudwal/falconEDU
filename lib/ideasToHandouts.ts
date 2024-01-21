import { BlockContent } from "@/types";

const ideasToHandouts = (ideas: BlockContent[]) => {
  return ideas.map(({ id, type, text }) => ({
    id,
    aid: type,
    content: text,
  }));
};

export default ideasToHandouts;
