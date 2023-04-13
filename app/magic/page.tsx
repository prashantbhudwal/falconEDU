"use client";
import Aid from "./Aid";
import AidNew from "./AidNew";
import Sidebar from "@/app/components/Sidebar";
import AidChip from "./AidChip";
import { teachingAids } from "./teachingAidsGenerator";

export default function Lesson() {
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <Sidebar
        className="col-start-1 col-span-2 row-start-1"
        heading={"Teaching Aids"}
      >
        {teachingAids.map((aid: string) => (
          <AidChip key={aid} text={aid} />
        ))}
      </Sidebar>
      <AidNew className="col-start-3 col-span-8 min-h-screen" />
    </div>
  );
}
