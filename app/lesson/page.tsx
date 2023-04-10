"use client";
import LessonCanvas from "./LessonCanvas";
export default function Lesson() {
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <LessonCanvas className="col-start-3 col-span-8 h-screen overflow-y-auto custom-scrollbar" />
    </div>
  );
}
