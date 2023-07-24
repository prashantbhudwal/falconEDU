"use client";
import { worksheetAidType } from "@/types";
const worksheetAids: worksheetAidType[] = ["worksheet", "answerKey"];
import Section from "@/components/Section";
import Sidebar from "@/components/Sidebar";
import SidebarButton from "@/app/(falcon)/(merlin)/magic/components/SidebarButton";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getEmoji, getName } from "@/utils";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { teachingAidsAtom } from "@/atoms/lesson";
import { worksheetAnswerKeyAtom, savedQuestionsAtom } from "@/atoms/worksheet";
import { useAtom } from "jotai";
import { getWorksheetDocx } from "@/utils/getWorksheetDocx";
import { generateAnswerKeyDocx } from "@/utils/generateAnswerKeyDocx";
import { topicAtom } from "@/atoms/preferences";

export default function AidLayout({ children }: { children: React.ReactNode }) {
  const [topic] = useAtom(topicAtom);
  const router = useRouter();
  const pathname = usePathname();
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  const [worksheetAnswerKey] = useAtom(worksheetAnswerKeyAtom);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full">
        <Sidebar className="col-start-1 col-span-2 row-start-1">
          <Section title="Teaching Aids" color="secondary">
            <SidebarButton
              onClick={() => router.push(`/raptor/magic/worksheet`)}
              isActive={pathname === `/raptor/magic/worksheet`}
            >
              {`${getEmoji("worksheet")} ${getName("worksheet")}`}
            </SidebarButton>
            {worksheetAids.map(
              (aid: worksheetAidType) =>
                aid != "worksheet" && (
                  <SidebarButton
                    onClick={() => router.push(`/raptor/magic/aid/${aid}`)}
                    isActive={pathname === `/raptor/magic/aid/${aid}`}
                    key={aid}
                  >
                    {`${getEmoji(aid)} ${getName(aid)}`}
                  </SidebarButton>
                )
            )}
          </Section>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setTeachingAids([]);
              router.push("/raptor");
            }}
          >
            Back
          </button>
          <button
            onClick={() => {
              savedQuestions.length > 0 && getWorksheetDocx(savedQuestions);
              savedQuestions.length > 0 &&
                worksheetAnswerKey.length > 0 &&
                generateAnswerKeyDocx({
                  topic,
                  title: "Answer Key",
                  fetchedContent: worksheetAnswerKey as string[],
                });
            }}
            className="btn btn-accent btn-sm"
          >
            Download
          </button>
        </Sidebar>
        <div className="col-start-3 col-span-8 min-h-screen">{children}</div>
      </div>
    </DndProvider>
  );
}
