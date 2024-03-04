"use client";
import Image from "next/image";
import React from "react";
import ReactPlayer from "react-player/youtube";

export const MediaPlayer = ({
  videoId,
  isValidId,
}: {
  videoId: string | undefined;
  isValidId: boolean;
}) => {
  if (!videoId || !isValidId)
    return (
      <div className="flex h-[350px] w-full flex-col items-center justify-center">
        <Image src="/emptyCanvas.png" alt="canvas" width={300} height={200} />
        <h1 className="text-xl">This video isn&apos;t available any more</h1>
      </div>
    );

  return (
    <ReactPlayer
      url={`https://www.youtube.com/watch?v=${videoId}`}
      volume={0.5}
      controls
      width={"100%"}
      height={350}
      playing
    />
  );
};
