import { useAtom } from "jotai";
import useLatestAid from "./useLatestAid";
import { lessonIdeasAtom } from "../atoms/lesson";
import { convertToDocx } from "../utils/convertToDocx";

export default function useDownloadContent() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const contentToDownload = [];
  const latestLesson = useLatestAid("lesson");
  contentToDownload.push(latestLesson);
  const latestOutline = useLatestAid("outline");
  contentToDownload.push(latestOutline);
  if (lessonIdeas.length === 0 || !latestLesson || !latestOutline) return;
  const handoutArray = lessonIdeas.filter((idea) => {
    return (
      idea.type === "story" || idea.type === "quiz" || idea.type === "activity"
    );
  });
  handoutArray.forEach((handout) => {
    contentToDownload.push(handout.text);
  });
  const docxArray: any = [];
  contentToDownload.forEach((content) => {
    // @ts-ignore
    convertToDocx(content).then((docx) => docxArray.push(docx));
  });
  return docxArray;
}
