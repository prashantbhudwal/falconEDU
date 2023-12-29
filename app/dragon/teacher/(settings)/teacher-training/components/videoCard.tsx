import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getYouTubeVideoMetadata } from "../utils";
import { FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { GiRabbit } from "react-icons/gi";

const calculateDurationInSeconds = (durationStr: string) => {
  if (!durationStr) return 0;

  const parts = durationStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

type VideoCardProps = React.HTMLProps<HTMLDivElement> & {
  videoId: string;
  className?: string;
  addToExistingLink?: boolean;
};

export const VideoCard = async ({
  videoId,
  className,
  addToExistingLink = false,
}: VideoCardProps) => {
  const metaData = await getYouTubeVideoMetadata({
    videoId,
  });

  const totalSeconds = calculateDurationInSeconds(metaData?.duration ?? "");
  const showRabbitIcon = totalSeconds <= 60;
  const formattedDuration =
    totalSeconds < 45 ? "30 secs" : `${Math.ceil(totalSeconds / 60)} min`;

  return (
    <Link
      href={addToExistingLink ? `${videoId}` : `player/${videoId}`}
      className={cn(
        "flex group items-center gap-5 rounded-[5px] py-3 px-5 w-[700px] mx-auto bg-base-100/50 mb-5",
        className
      )}
    >
      <div className="relative">
        <Image
          src={metaData?.thumbnail || "/chubbi.png"}
          alt="thumbnail"
          width={120}
          height={80}
          className="rounded-[5px] aspect-[1.7] object-cover"
        />
        <div className="opacity-0 group-hover:opacity-100 transition-all absolute top-0 bottom-0 left-0 right-0 bg-black/50 rounded-[5px]" />
        <FaPlay className="opacity-0 group-hover:opacity-100 transition-all text-slate-100 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="w-9/12 text-start">
        <h3 className="whitespace-nowrap truncate font-semibold mb-3 w-full text-slate-300">
          {metaData?.title || "Video"}
        </h3>
        <div className="flex gap-5 text-sm">
          <div className="flex justify-between items-center w-full">
            <div>{formattedDuration}</div>
            {showRabbitIcon && (
              <div className="flex space items-center space-x-3 text-info">
                <GiRabbit className="scale-x-[-1]" />
                <div> very short </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
