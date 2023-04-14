import { StreamPayload } from "@/types";

import getLessonPlanMessages from "./lessonPlan";

export default function getChatCompletionRequestMessages(
  payload: StreamPayload
) {
  const { payloadType } = payload;

  switch (payloadType) {
    case "lesson":
      return getLessonPlanMessages(payload);
    case "outline":
      return getLessonPlanMessages(payload);
    default:
      return [];
  }
}
