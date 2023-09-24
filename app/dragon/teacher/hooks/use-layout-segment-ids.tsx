"use client";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";

export function useTeacherLayoutSegments() {
  const layoutSegments = useSelectedLayoutSegments();
  const layoutSegment = useSelectedLayoutSegment();
  const classIndex = layoutSegments.indexOf("class");
  const classId = classIndex === -1 ? null : layoutSegments[classIndex + 1];
  const botIndex = layoutSegments.indexOf("bot");
  const botId = botIndex === -1 ? null : layoutSegments[botIndex + 1];
  const testIndex = layoutSegments.indexOf("test");
  const testId = testIndex === -1 ? null : layoutSegments[testIndex + 1];
  return { layoutSegment, layoutSegments, classId, botId, testId };
}
