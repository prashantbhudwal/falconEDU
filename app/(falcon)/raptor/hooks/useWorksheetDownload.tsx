import { useAtom } from "jotai";
import { lessonIdeasAtom } from "../../../../atoms/lesson";
import { convertToDocx } from "../../../../lib/convertToDocx";

export default function useDownloadContent() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const docxArray: any = [];
  return docxArray;
}
