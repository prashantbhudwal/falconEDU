import React from "react";
import { videosData } from "../../data";
import { VideoCard } from "../../components/videoCard";
import { getVideoIdFromYoutubeUrl, getYouTubeVideoMetadata } from "../../utils";
import { MediaPlayer } from "./mediaPlayer";

const VideoPlayer = async ({ params }: { params: { videoId: string } }) => {
  //getting remaining videos except the running one from the videosData by checking of the url includes the videoId
  const remainingVideos = videosData.videos.filter(
    (video) => !video.url.includes(params.videoId!)
  );
  const metaData = await getYouTubeVideoMetadata({ videoId: params.videoId });

  return (
    <div className="w-[700px] mx-auto">
      <MediaPlayer videoId={params.videoId} isValidId={!!metaData} />
      <div className="py-20">
        <h2 className="text-3xl font-semibold mb-5">Explore more</h2>
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
