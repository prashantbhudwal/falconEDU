import { BlockContent } from "@/types";
import { generateDocx } from "../../../../../lib/generateDocx";

export const getSelectedBlockContent = (
  selectedBlockId: any,
  lessonIdeas: BlockContent[],
) => {
  // Find the block with the selected id
  const selectedBlock = lessonIdeas.find(
    (block) => block.id === selectedBlockId,
  );
  return selectedBlock?.text;
};

export const downloadBlock = (
  id: string,
  lessonIdeas: BlockContent[],
  subtopic: string,
) => {
  const blockToDownload = lessonIdeas.filter((idea) => idea.id == id);
  const content = blockToDownload[0].text;
  const payload = {
    topic: blockToDownload[0].type,
    subtopic,
    fetchedContent: content,
  };
  generateDocx(payload);
};
