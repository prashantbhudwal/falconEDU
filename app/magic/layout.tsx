"use client";
import AidCanvas from "./aid/[aid]/AidCanvas";
import Sidebar from "@/components/Sidebar";
import Section from "../../components/Section";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { teachingAids } from "./hooks/useTeachingAids";
import useHandouts from "./hooks/useHandouts";
import { aidType, handoutType } from "@/types";
import SidebarButton from "./components/SidebarButton";
import { getEmoji, getName } from "@/app/utils";
export default function AidLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const handouts = useHandouts();

  useEffect(() => {
    if (topic === "" || subtopic === "") {
      router.push("/preferences");
    }
  }, [topic, subtopic, router]);

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
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
      </Sidebar>
      <AidCanvas className="col-start-3 col-span-8 min-h-screen">
        {children}
      </AidCanvas>
    </div>
  );
}
