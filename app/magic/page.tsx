"use client";
import AidCanvas from "./AidCanvas";
import Sidebar from "@/app/components/Sidebar";
import AidChip from "./AidChip";
import { teachingAids } from "./teachingAidsGenerator";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Aid from "./Aid";
import { visibleAidAtom } from "../atoms/lesson";
export default function Lesson() {
  const router = useRouter();
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [visibleAid, setVisibleAid] = useAtom(visibleAidAtom);

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
        {teachingAids.map((aid: string) => (
          <AidChip key={aid} aid={aid} onClick={() => setVisibleAid(aid)} />
        ))}
      </Sidebar>
      <AidCanvas className="col-start-3 col-span-8 min-h-screen">
        <Aid />
      </AidCanvas>
    </div>
  );
}
