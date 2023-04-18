"use client";
import AidCanvas from "./components/AidCanvas";
import Sidebar from "@/app/components/Sidebar";
import AidChip from "./components/AidChip";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { teachingAids } from "../hooks/useTeachingAids";
import useHandouts from "@/app/hooks/useHandouts";
import HandoutChip from "./components/HandoutChip";
import { aidType, handoutType } from "@/types";
export default function AidLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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
      <Sidebar
        className="col-start-1 col-span-2 row-start-1"
        heading={"Teaching Aids"}
      >
        {teachingAids.map((aid: aidType) => (
          <AidChip key={aid} aid={aid} />
        ))}
        {handouts.length != 0 &&
          handouts.map((handout: handoutType) => (
            <HandoutChip key={handout} aid={handout} />
          ))}
      </Sidebar>
      <AidCanvas className="col-start-3 col-span-8 min-h-screen">
        {children}
      </AidCanvas>
    </div>
  );
}
