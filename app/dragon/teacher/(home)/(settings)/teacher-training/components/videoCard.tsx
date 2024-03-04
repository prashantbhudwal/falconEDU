import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getVideoIdFromYoutubeUrl, getYouTubeVideoMetadata } from "../utils";
import { FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { GiRabbit } from "react-icons/gi";

// const calculateDurationInSeconds = (durationStr: string) => {
//   if (!durationStr) return 0;

//   const parts = durationStr.split(":").map(Number);
//   if (parts.length === 3) {
//     return parts[0] * 3600 + parts[1] * 60 + parts[2];
//   } else if (parts.length === 2) {
//     return parts[0] * 60 + parts[1];
//   }
//   return 0;
// };

type VideoCardProps = React.HTMLProps<HTMLDivElement> & {
  className?: string;
  addToExistingLink?: boolean;
  video: any;
};

export const VideoCard = async ({
  className,
  addToExistingLink = false,
  video,
}: VideoCardProps) => {
  // const metaData = await getYouTubeVideoMetadata({
  //   videoId,
  // });

  const videoId = getVideoIdFromYoutubeUrl(video.url);
  const totalSeconds = video.duration;
  const showRabbitIcon = totalSeconds <= 60;
  const formattedDuration =
    totalSeconds < 45 ? "30 secs" : `${Math.ceil(totalSeconds / 60)} min`;

  const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  return (
    <Link
      href={addToExistingLink ? `${videoId}` : `player/${videoId}`}
      className={cn(
        "group mx-auto mb-5 flex w-[700px] items-center gap-5 rounded-[5px] bg-base-100/50 px-5 py-3",
        className,
      )}
    >
      <div className="relative">
        <Image
          src={thumbnail || "/chubbi.png"}
          alt="thumbnail"
          width={120}
          height={80}
          className="aspect-[1.7] rounded-[5px] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 top-0 rounded-[5px] bg-black/50 opacity-0 transition-all group-hover:opacity-100" />
        <FaPlay className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-slate-100 opacity-0 transition-all group-hover:opacity-100" />
      </div>
      <div className="w-9/12 text-start">
        <h3 className="mb-3 w-full truncate whitespace-nowrap font-semibold text-slate-300">
          {video.title || "Video"}
        </h3>
        <div className="flex gap-5 text-sm">
          <div className="flex w-full items-center justify-between">
            <div>{formattedDuration}</div>
            {showRabbitIcon && (
              <div className="space flex items-center space-x-3 text-info">
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
