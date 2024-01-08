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
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isSendingAudio, setIsSendingAudio] = useState(false);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const toggleRecording = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (recording) {
      mediaRecorder?.stop();
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      setMediaRecorder(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const newRecorder = new MediaRecorder(stream);
        newRecorder.ondataavailable = (event: BlobEvent) => {
          setAudioChunks((currentChunks) => [...currentChunks, event.data]);
        };
        newRecorder.start();
        setMediaRecorder(newRecorder);
        setRecording(true);
      } catch (error) {
        console.error("Error accessing microphone: ", error);
      }
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
        setInput(response.data.transcription);
      } catch (error) {
        console.error("Error sending audio to server:", error);
      }
      setIsSendingAudio(false);
    }
  };

  useEffect(() => {
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
          disabled={isLoading || isSendingAudio || input.length > 0}
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
                className={cn("w-7 h-7 text-secondary", {
                  "text-red-500": recording,
                  "text-base-200": isLoading || isSendingAudio,
                })}
              />
            ) : (
              <MicrophoneIcon
                className={cn("h-7 text-secondary", {
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
          placeholder={
            recording
              ? "listening..."
              : isSendingAudio
                ? "processing..."
                : "Type a message..."
          }
          spellCheck={false}
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm disabled:cursor-not-allowed",
            {
              " placeholder:animate-pulse placeholder-shown:animate-pulse placeholder-shown:font-bold":
                isSendingAudio,
            }
          )}
        />
        <Button
          variant="ghost"
          type="submit"
          size="icon"
          disabled={isLoading || input === ""}
          className="mr-2 hover:bg-base-300"
        >
          <PaperAirplaneIcon className="text-secondary" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
