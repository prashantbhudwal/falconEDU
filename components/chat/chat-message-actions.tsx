"use client";

import { type Message } from "ai";

import { Button } from "@ui/button";
import { IconCheck, IconCopy } from "@ui/icons";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { PlayIcon, PlayPauseIcon } from "@heroicons/react/24/solid";
import { BounceLoader, ScaleLoader } from "react-spinners";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [audioSrc, setAudioSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  const generateSpeech = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/dragon/ai/speak",
        { text: message.content },
        { responseType: "blob" }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0",
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? <IconCheck /> : <ClipboardIcon className="h-4 w-4" />}
        <span className="sr-only">Copy message</span>
      </Button>
      {isLoading ? (
        <BounceLoader className="bg-secondary h-10 " />
      ) : isPlaying ? (
        <ScaleLoader className="bg-secondary h-10" />
      ) : (
        <Button variant="ghost" size="icon" onClick={generateSpeech}>
          {isCopied ? <PlayPauseIcon /> : <PlayIcon className="h-4 w-4" />}
          <span className="sr-only">Listen</span>
        </Button>
      )}
    </div>
  );
}
