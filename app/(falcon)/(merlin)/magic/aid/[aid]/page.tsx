"use client";
import { useAid } from "../../hooks/useAid";
import Issue from "@/components/Issue";
import { useAtom } from "jotai";
import { useState } from "react";
import useLatestAid from "../../hooks/useLatestAid";
import { useEffect } from "react";
import { shouldRegenerateAtom } from "@/atoms/lesson";
import {
  topicAtom,
  subtopicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/atoms/preferences";
import Header from "@/components/Header";
import useDownloadContent from "@/app/(falcon)/(merlin)/magic/hooks/useDownloadContent";
import { contentStreamCompletedAtom, teachingAidsAtom } from "@/atoms/lesson";
import Sidebar from "@/components/Sidebar";
import Section from "@/components/Section";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { teachingAids } from "../../hooks/useTeachingAids";
import useHandouts from "../../hooks/useHandouts";
import { aidType, handoutType } from "@/types";
import SidebarButton from "../../components/SidebarButton";
import { getEmoji, getName } from "@/utils";
import { downloadZip } from "@/utils/downloadZip";
import MerlinGrid from "../../../components/Grid";

export default function Page({ params }: { params: { aid: aidType } }) {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [showNote, setShowNote] = useState(false);
  const { content, startStreaming } = useAid(params.aid);
  // console.log(params.aid);
  const latestAid = useLatestAid(params.aid);
  // console.log(latestAid);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const docxArray = useDownloadContent();

  const router = useRouter();
  const pathname = usePathname();
  const handouts = useHandouts();
  const [_, setTeachingAidsAt] = useAtom(teachingAidsAtom);

  //TODO Uncomment this
  // useEffect(() => {
  //   if (topic === "" || subtopic === "") {
  //     router.push("/preferences");
  //   }
  // }, [topic, subtopic, router]);

  useEffect(() => {
    startStreaming();
  }, []);
  useEffect(() => {
    if (shouldRegenerate) {
      startStreaming();
    }
  }, [shouldRegenerate]);

  return (
    <div className="overflow-y-auto h-full">
      <MerlinGrid>
        <Sidebar className="col-start-1 col-span-2 row-start-1">
          <Section title="Teaching Aids">
            {teachingAids.map((aid: aidType) => (
              <SidebarButton
                onClick={() => router.push(`/magic/aid/${aid}`)}
                isActive={pathname === `/magic/aid/${aid}`}
                key={aid}
              >
                {`${getEmoji(aid)} ${getName(aid)}`}
              </SidebarButton>
            ))}
            {handouts.length != 0 &&
              handouts.map((handout: handoutType) => (
                <SidebarButton
                  onClick={() => router.push(`/magic/handout/${handout}`)}
                  isActive={pathname === `/magic/handout/${handout}`}
                  key={handout}
                >
                  {`${getEmoji(handout)} ${getName(handout)}`}
                </SidebarButton>
              ))}
          </Section>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setTeachingAidsAt([]);
              router.push("/merlin");
            }}
            disabled={!contentStreamCompleted}
          >
            Planner
          </button>
          <button
            onClick={() => {
              downloadZip(docxArray);
            }}
            className="btn btn-accent btn-sm"
            disabled={!contentStreamCompleted}
          >
            Download
          </button>
        </Sidebar>
        <div
          className={`col-start-3 col-span-8 leading-7 text-lg whitespace-pre-wrap mt-0 h-full shadow-md bg-slate-200 py-4 flex flex-col items-center gap-4 text-slate-800 px-6 pb-96 marker:h-full scroll-smooth overflow-y-scroll custom-scrollbar`}
        >
          <p>{contentStreamCompleted ? latestAid : content}</p>
        </div>
      </MerlinGrid>
    </div>
  );
}

// {/* {contentStreamCompleted && (
//             <p
//               className="text-emerald-600 cursor-pointer underline underline-offset-2 ml-auto text-center font-semibold"
//               onMouseEnter={() => setShowNote(true)}
//               onMouseLeave={() => setShowNote(false)}
//             >
//               Facing Issues?
//             </p>
//           )}
//           {showNote && <Issue />} */}
