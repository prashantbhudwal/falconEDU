import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const VideoCard = ({ videoUrl }: { videoUrl: string }) => {
  const shadowAnimation = {
    initial: {
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)", // No shadow
    },
    animate: {
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)", // Visible shadow
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={shadowAnimation}
      transition={{ duration: 0.5 }}
    >
      <Card className="mx-auto w-fit shadow-lg shadow-secondary">
        <CardHeader>
          <CardTitle>Recommended Video</CardTitle>
        </CardHeader>
        <CardContent className="bg-base-200">
          {ReactPlayer.canPlay(videoUrl) ? (
            <ReactPlayer
              url={videoUrl}
              controls={true}
              height={200}
              width={"100%"}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-center text-gray-500">
                This video is not supported.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
