import { StreamPayload } from "@/types";

import getLessonPlanMessages from "./lessonPlan";
import getOutlineMessages from "./outline";

export default function getChatCompletionRequestMessages(
  payload: StreamPayload
) {
  const { payloadType } = payload;

  switch (payloadType) {
    case "lesson":
      return getLessonPlanMessages(payload);
    case "outline":
      return getOutlineMessages(payload);
    default:
      return [];
  }
}
