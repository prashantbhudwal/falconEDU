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

  const generateSpeech = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/dragon/ai/speak",
        { text: message.content },
        { responseType: "blob" }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null); // Reset the audio when it ends
      };
      await newAudio.play();
      setIsPlaying(true);
      setAudio(newAudio); // Set the audio
    } catch (error) {
      console.error("Error generating speech:", error);
    }
    setIsLoading(false);
  }, [message.content]);

  const pauseSpeech = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const renderButton = useMemo(() => {
    if (isLoading) {
      return (
        <div className="p-2  w-9 h-9 rounded-md">
          <BounceLoader size={20} color="#94a3b8" />
        </div>
      );
    } else if (isPlaying) {
      return (
        <Button variant="ghost" size="icon" onClick={pauseSpeech}>
          <FaPause className="h-4 w-4" />
          <span className="sr-only">Pause</span>
        </Button>
      );
    } else {
      return (
        <Button variant="ghost" size="icon" onClick={generateSpeech}>
          {<HiSpeakerWave className="h-4 w-4" />}
          <span className="sr-only">Listen</span>
        </Button>
      );
    }
  }, [isLoading, isPlaying, pauseSpeech, generateSpeech]);

  return (
    <div
      className={cn(
        "flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-20 md:-top-5 ",
        className,
        {
          "md:opacity-0": !isLastMessage && !isLoading && !isPlaying,
        }
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? <IconCheck /> : <ClipboardIcon className="h-4 w-4" />}
        <span className="sr-only">Copy message</span>
      </Button>
      {renderButton}
    </div>
  );
}
