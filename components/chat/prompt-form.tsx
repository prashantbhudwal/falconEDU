"use client";
import { UseChatHelpers } from "ai/react";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import { PaperAirplaneIcon, MicrophoneIcon } from "@heroicons/react/24/solid";
import axios from "axios";

import { Button } from "@ui/button";
import { useEnterSubmit } from "../../hooks/use-enter-submit";
import { cn } from "@/lib/utils";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // State for recording
  const [loading, setLoading] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] =
    React.useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);
  const [isSendingAudio, setIsSendingAudio] = React.useState(false);

  React.useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  let recordTimeout: NodeJS.Timeout;

  const toggleRecording = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (recording) {
      mediaRecorder?.stop();
      setRecording(false);
      clearTimeout(recordTimeout); // Clear the timeout when recording stops manually
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setAudioChunks((currentChunks) => [...currentChunks, event.data]);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);

      recordTimeout = setTimeout(() => {
        if (recording) {
          recorder.stop(); // Stop recording after 30 seconds
          setRecording(false);
        }
      }, 60000); // Set timeout for 60 seconds
    }
  };

  const sendAudioToServer = async () => {
    setLoading(true);
    setIsSendingAudio(true);
    const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
    const audioFile = new File([audioBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);

      try {
        const response = await axios
          .post("/dragon/ai/transcribe", formData)
          .finally(() => setLoading(false));
        console.log("Response:", response);
        setInput(response.data.transcription);
      } catch (error) {
        console.error("Error sending audio to server:", error);
      }
      setIsSendingAudio(false);
    }
  };

  React.useEffect(() => {
    if (!recording && audioChunks.length > 0) {
      sendAudioToServer();
      setAudioChunks([]);
    }
  }, [recording]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        await onSubmit(input);
      }}
      ref={formRef}
    >
      <div className="flex items-center space-x-2 bg-base-300 shadow-md shadow-base-300 relative w-full">
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading || isSendingAudio}
          onClick={toggleRecording}
          className="flex-none"
        >
          <div
            className={cn("", {
              "animate-pulse rounded-full bg-accent scale-110": recording,
            })}
          >
            <MicrophoneIcon
              className={cn("w-8 h-8 text-secondary", {
                "text-red-500": recording,
                "text-base-200": isLoading || isSendingAudio,
              })}
            />
          </div>
        </Button>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          disabled={isLoading || isSendingAudio}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isLoading || isSendingAudio ? "Processing..." : "Type a message..."
          }
          spellCheck={false}
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm disabled:cursor-not-allowed",
            {
              "border-2 border-accent placeholder:animate-pulse placeholder-shown:animate-pulse placeholder-shown:font-bold":
                isLoading || isSendingAudio,
            }
          )}
        />
        <Button
          variant="ghost"
          type="submit"
          size="icon"
          disabled={isLoading || input === ""}
          className="mr-2"
        >
          <PaperAirplaneIcon className="text-secondary" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
