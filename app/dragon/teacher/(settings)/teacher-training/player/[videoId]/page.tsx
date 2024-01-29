import React from "react";
import { videosData } from "../../data";
import { VideoCard } from "../../components/videoCard";
import { getVideoIdFromYoutubeUrl, getYouTubeVideoMetadata } from "../../utils";
import { MediaPlayer } from "./mediaPlayer";

const VideoPlayer = async ({ params }: { params: { videoId: string } }) => {
  //getting remaining videos except the running one from the videosData by checking of the url includes the videoId
  const remainingVideos = videosData.videos.filter(
    (video) => !video.url.includes(params.videoId!),
  );
  const metaData = await getYouTubeVideoMetadata({ videoId: params.videoId });

  return (
    <div className="mx-auto w-[700px]">
      <MediaPlayer videoId={params.videoId} isValidId={!!metaData} />
      <div className="py-20">
        <h2 className="mb-5 text-3xl font-semibold">Explore more</h2>
        {remainingVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            addToExistingLink
            className="w-11/12"
          />
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
