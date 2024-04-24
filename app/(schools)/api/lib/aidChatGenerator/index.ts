import { StreamPayload } from "@/types";

import getLessonPlanMessages from "./lessonPlan";
import getOutlineMessages from "./outline";
import getBlackboardMessages from "./blackboard";
import getShortVideoScriptMessages from "./shortVideoScript";

export default function getChatCompletionRequestMessages(
  payload: StreamPayload,
) {
  const { payloadType } = payload;

  switch (payloadType) {
    case "lesson":
      return getLessonPlanMessages(payload);
    case "outline":
      return getOutlineMessages(payload);
    case "blackboard":
      return getBlackboardMessages(payload);
    case "shortVideoScript":
      return getShortVideoScriptMessages(payload);
    default:
      return [];
  }
}
