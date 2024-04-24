import React from "react";
import { videosData } from "../data";
import { VideoCard } from "../components/videoCard";
import { getVideoIdFromYoutubeUrl } from "../utils";
import { Paper } from "@/components/ui/paper";

const TeacherTrainingPage: React.FC = async () => {
  return (
    <Paper>
      <div className="text-center">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-semibold tracking-wider text-slate-300">
            Teacher Training
          </h1>
          <span className="tracking-wider ">For FalconAI</span>
        </div>
        <main className="py-10">
          {videosData.videos.map((video) => {
            return <VideoCard key={video.id} video={video} />;
          })}
        </main>
      </div>
    </Paper>
  );
};

export default TeacherTrainingPage;
