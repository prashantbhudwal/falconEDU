import { useAtom } from "jotai";
import { lessonIdeasAtom } from "../../../../atoms/lesson";
import { convertToDocx } from "../../../../utils/convertToDocx";

export default function useDownloadContent() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const docxArray: any = [];
  return docxArray;
}
