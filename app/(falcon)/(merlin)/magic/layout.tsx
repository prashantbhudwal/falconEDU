"use client";
import SidebarButton from "./components/SidebarButton";
import { getEmoji, getName } from "@/utils";
import { downloadZip } from "@/utils/downloadZip";
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
import { contentStreamCompletedAtom, teachingAidsAtom } from "@/atoms/lesson";

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
        {children}
      </MerlinGrid>
    </div>
  );
}
