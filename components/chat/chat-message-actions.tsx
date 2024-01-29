"use client";

import { type Message } from "ai";

import { Button } from "@ui/button";
import { IconCheck, IconCopy } from "@ui/icons";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { PlayIcon, PlayPauseIcon } from "@heroicons/react/24/solid";
import { BounceLoader, ScaleLoader } from "react-spinners";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaPause } from "react-icons/fa6";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
  isLastMessage?: boolean;
}

/**
 * Renders the actions for a chat message.
 *
 * @param message - The chat message.
 * @param className - Additional class name for styling.
 * @param isLastMessage - Indicates if the message is the last one in the chat.
 * @returns The rendered chat message actions.
 */
export function ChatMessageActions({
  message,
  className,
  isLastMessage,
  ...props
}: ChatMessageActionsProps): JSX.Element {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [audioSrc, setAudioSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onCopy = useCallback(() => {
    if (isCopied) return;
    copyToClipboard(message.content);
  }, [isCopied, copyToClipboard, message.content]);

  const playSpeech = useCallback(async () => {
    if (audio) {
      audio.play();
      setIsPlaying(true);
    } else {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "/dragon/ai/speak",
          { text: message.content },
          { responseType: "blob" },
        );
        const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newAudio = new Audio(audioUrl);
        newAudio.onended = () => {
          setIsPlaying(false);
        };
        setAudio(newAudio); // Set the audio
        newAudio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error generating speech:", error);
      }
      setIsLoading(false);
    }
  }, [audio, message.content]);

  // Pause the audio
  const pauseSpeech = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const renderButton = useMemo(() => {
    if (isLoading) {
      return (
        <div className="h-9  w-9 rounded-md p-2">
          <BounceLoader size={20} color="#94a3b8" />
        </div>
      );
    } else if (isPlaying) {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-[5px] hover:bg-transparent hover:text-slate-100"
            onClick={pauseSpeech}
          >
            <FaPause className="h-4 w-4" />
            <span className="sr-only">Pause</span>
          </Button>
          <div className="flex  h-9 w-9 items-center justify-center rounded-md p-2">
            <ScaleLoader
              className="px-2"
              height={10}
              width={2}
              color="#94a3b8"
            />
          </div>
        </div>
      );
    } else {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-[5px] hover:bg-transparent hover:text-slate-100"
          onClick={isPlaying ? pauseSpeech : playSpeech}
        >
          {<HiSpeakerWave className="h-4 w-4" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Listen"}</span>
        </Button>
      );
    }
  }, [isLoading, isPlaying, pauseSpeech, playSpeech]);

  return (
    <div
      className={cn(
        "flex items-center justify-start transition-opacity group-hover:opacity-100 md:absolute md:-top-3 md:right-0 md:translate-x-full ",
        className,
        {
          "opacity-0": !isLastMessage && !isLoading && !isPlaying,
        },
        {
          "opacity-1": message.role !== "user",
        },
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-[5px] hover:bg-transparent hover:text-slate-100"
        onClick={onCopy}
      >
        {isCopied ? <IconCheck /> : <ClipboardIcon className="h-4 w-4" />}
        <span className="sr-only">Copy message</span>
      </Button>
      {message.role !== "user" && renderButton}
    </div>
  );
}
