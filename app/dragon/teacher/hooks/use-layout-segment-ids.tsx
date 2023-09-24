"use client";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";

export function useTeacherLayoutSegments() {
  const layoutSegments = useSelectedLayoutSegments();
  const currentSegment = useSelectedLayoutSegment();
  console.log(layoutSegments.indexOf("class"));
  console.log(layoutSegments.indexOf("bot"));
  console.log(layoutSegments.indexOf("test"));

  const classId =
    layoutSegments[
      layoutSegments.findIndex((segment) => (segment = "class")) + 1
    ];
  console.log({ classId });
  const botId = layoutSegments[layoutSegments.indexOf("bot") + 1];
  const testId = layoutSegments[layoutSegments.indexOf("test") + 1];
  console.log({ currentSegment, classId, botId, testId });
  return { currentSegment, classId, botId, testId };
}
