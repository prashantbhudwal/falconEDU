import { useAtom } from "jotai";
import useLatestAid from "./useLatestAid";
import { lessonIdeasAtom } from "../../../../../atoms/lesson";
import { convertToDocx } from "../../../../../lib/convertToDocx";

export default function useDownloadContent() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const contentToDownload = [];
  const latestLesson = useLatestAid("lesson");
  contentToDownload.push(latestLesson);
  const latestOutline = useLatestAid("outline");
  if (latestOutline && latestOutline.length > 0) {
    contentToDownload.push(latestOutline);
  }
  const latestBlackboard = useLatestAid("blackboard");
  if (latestBlackboard && latestBlackboard.length > 0) {
    contentToDownload.push(latestBlackboard);
  }
  const latestShortVideoScript = useLatestAid("shortVideoScript");
  if (latestShortVideoScript && latestShortVideoScript.length > 0) {
    contentToDownload.push(latestShortVideoScript);
  }
  if (lessonIdeas.length === 0 || !latestLesson) return;
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
