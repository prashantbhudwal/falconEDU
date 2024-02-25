import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";

export function VideoDialog({ url, title }: { url: string; title: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Preview Video
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-7xl md:w-fit">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {ReactPlayer.canPlay(url) ? (
          <ReactPlayer url={url} playing={true} controls={true} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-center text-gray-500">
              This video is not supported.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
