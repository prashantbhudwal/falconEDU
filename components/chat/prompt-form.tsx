"use client";
import { UseChatHelpers } from "ai/react";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
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

  React.useEffect(() => {
    // Initialize media stream and recorder
    const initRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setAudioChunks((currentChunks) => [...currentChunks, event.data]);
      };
      setMediaRecorder(recorder);
    };
    initRecorder();
  }, []);

  let recordTimeout: NodeJS.Timeout;

  const toggleRecording = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (recording) {
      mediaRecorder?.stop();
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop()); // Stop each track of the stream
      setRecording(false);
      setMediaRecorder(null); // Clear the recorder
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new MediaRecorder(stream);
      newRecorder.ondataavailable = (event) => {
        setAudioChunks((currentChunks) => [...currentChunks, event.data]);
      };
      newRecorder.start();
      setMediaRecorder(newRecorder);
      setRecording(true);
    }
  };

  React.useEffect(() => {
    return () => {
      // Clean up on unmount
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
    };
  }, [mediaRecorder]);

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
  }, [recording, audioChunks]);

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
      <div className="flex items-center space-x-2 bg-base-300 shadow-md shadow-base-300 relative w-full px-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading || isSendingAudio}
          onClick={toggleRecording}
          className="sm:hover:bg-base-300 sm:hover:text-secondary flex-none"
        >
          <div
            className={cn("", {
              "animate-pulse rounded-full bg-accent scale-110": recording,
            })}
          >
            {recording ? (
              <StopIcon
                className={cn("w-8 h-8 text-secondary", {
                  "text-red-500": recording,
                  "text-base-200": isLoading || isSendingAudio,
                })}
              />
            ) : (
              <MicrophoneIcon
                className={cn("w-8 h-8 text-secondary", {
                  "text-red-500": recording,
                  "text-base-200": isLoading || isSendingAudio,
                })}
              />
            )}
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
          placeholder={isSendingAudio ? "Processing..." : "Type a message..."}
          spellCheck={false}
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm disabled:cursor-not-allowed",
            {
              "border-2 border-accent placeholder:animate-pulse placeholder-shown:animate-pulse placeholder-shown:font-bold":
                isSendingAudio,
            }
          )}
        />
        <Button
          variant="ghost"
          type="submit"
          size="icon"
          disabled={isLoading || input === ""}
          className="mr-2 sm:hover:bg-base-300 sm:hover:text-secondary"
        >
          <PaperAirplaneIcon className="text-secondary" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
