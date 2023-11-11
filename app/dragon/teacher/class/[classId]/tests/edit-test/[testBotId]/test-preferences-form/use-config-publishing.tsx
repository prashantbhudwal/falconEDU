import {
  publishBotConfig,
  unPublishBotConfig,
} from "@/app/dragon/teacher/mutations";
import { SetStateAction } from "react";
// Known issue: Set error tightly coupled to the component
export function useConfigPublishing({
  classId,
  botId,
  setError,
}: {
  classId: string;
  botId: string;
  setError: (value: SetStateAction<string | null>) => void;
}) {
  const onPublish = async () => {
    const result = await publishBotConfig(classId, botId);
    if (result.success) {
    } else {
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };

  const onUnPublish = async () => {
    const result = await unPublishBotConfig(classId, botId);
    if (result.success) {
    } else {
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };
  return { onPublish, onUnPublish };
}
