import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAudioRecording } from "./use-audio-recording";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/solid";
import { TaskType } from "@/types";
export const RecordingButton = ({
  type,
  attemptId,
  taskId,
  setInput,
}: {
  type: TaskType;
  attemptId: string;
  taskId: string;
  setInput: (value: string) => void;
}) => {
  const { isRecording, toggleRecording } = useAudioRecording(
    type,
    attemptId,
    taskId,
    setInput,
  );
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleRecording}
      className="flex-none sm:hover:bg-base-300 sm:hover:text-secondary"
    >
      <div
        className={cn("", {
          "scale-110 animate-pulse rounded-full bg-accent": isRecording,
        })}
      >
        {isRecording ? (
          <StopIcon
            className={cn("h-7 w-7 text-secondary", {
              "text-red-500": isRecording,
            })}
          />
        ) : (
          <MicrophoneIcon
            className={cn("h-7 text-secondary", {
              "text-red-500": isRecording,
            })}
          />
        )}
      </div>
    </Button>
  );
};
