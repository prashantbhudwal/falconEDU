import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getYouTubeVideoMetadata } from "../utils";
import { FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";

type PropType = React.HTMLProps<HTMLDivElement> & {
  videoId: string;
  className?: string;
  addToExistingLink?: boolean;
};

export const VideoCard = async ({
  videoId,
  className,
  addToExistingLink = false,
}: PropType) => {
  const metaData = await getYouTubeVideoMetadata({
    videoId,
  });

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
        <h3 className="text-lg whitespace-nowrap truncate font-semibold mb-3 w-full text-slate-300">
          {metaData?.title || "Random Video"}
        </h3>
        <div className="flex gap-5 text-sm">
          <p>{metaData?.duration || "00:00"}</p>
          <p>{metaData?.publishedAt.toLocaleDateString() || "N/A"}</p>
        </div>
      </div>
    </Link>
  );
};
