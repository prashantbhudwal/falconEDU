import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactPlayer from "react-player";
import { videoSchema } from "@/lib/schema";
import { z } from "zod";
import { PlayIcon } from "@/components/icons";

export const VideoCard = ({
  video,
}: {
  video: z.infer<typeof videoSchema>;
}) => {
  return (
    <Card className=" rounded-xl ">
      <CardHeader className="py-2">
        <CardTitle className="text-sm">{video.title}</CardTitle>
      </CardHeader>
      <CardContent className="rounded-lg px-2 py-2">
        <div className="overflow-clip rounded-xl">
          <ReactPlayer
            url={video.url}
            height={150}
            width={260}
            light
            playIcon={<PlayIcon size="xl" color="purple" />}
            controls
          />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-slate-600">
        {video.metadata}
      </CardFooter>
    </Card>
  );
};
