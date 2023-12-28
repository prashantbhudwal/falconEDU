import React from "react";
import { videosData } from "../data";
import { VideoCard } from "../components/videoCard";
import { getVideoIdfromYoutubeUrl } from "../utils";

const TeacherTrainingPage: React.FC = async () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-semibold tracking-wider">
        Teacher Training
      </h1>
      <span className="tracking-wider">
        by <strong>FalconAI</strong>
      </span>

      <main className="py-10">
        {videosData.videos.map((video) => {
          return (
            <VideoCard
              key={video.id}
              videoId={getVideoIdfromYoutubeUrl(video.url)}
            />
          );
        })}
      </main>
    </div>
  );
};

export default TeacherTrainingPage;
