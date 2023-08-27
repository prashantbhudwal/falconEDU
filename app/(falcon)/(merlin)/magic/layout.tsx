"use client";
import SidebarButton from "./components/SidebarButton";
import { getEmoji, getName } from "@/lib";
import { downloadZip } from "@/lib/downloadZip";
import MerlinGrid from "../components/Grid";
import Sidebar from "@/components/Sidebar";
import Section from "@/components/Section";
import { teachingAids } from "./hooks/useTeachingAids";
import Header from "@/components/Header";
import useDownloadContent from "@/app/(falcon)/(merlin)/magic/hooks/useDownloadContent";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import useHandouts from "./hooks/useHandouts";
import { aidType, handoutType } from "@/types";
import { useAtom } from "jotai";
import {
  contentStreamCompletedAtom,
  teachingAidsAtom,
} from "@/lib/atoms/lesson";
import { savedQuestionsAtom } from "@/lib/atoms/worksheet";
export default function MagicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docxArray = useDownloadContent();
  const router = useRouter();
  const pathname = usePathname();
  const handouts = useHandouts();
  const [_, setTeachingAidsAt] = useAtom(teachingAidsAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [savedQuestions] = useAtom(savedQuestionsAtom);

  return (
    <div className="h-full overflow-y-auto">
      <MerlinGrid>
        <Sidebar className="col-span-2 col-start-1 row-start-1">
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
        </Sidebar>
        <div className="col-span-8 col-start-3 min-h-screen bg-slate-950">
          {children}
        </div>
      </MerlinGrid>
    </div>
  );
}
