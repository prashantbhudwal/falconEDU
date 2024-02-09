"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { videoSchema } from "@/lib/schema";
import { z } from "zod";
import { TaskType } from "@/types";
import { MediaIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { VideoCard } from "./video-card";
import { db } from "@/lib/routers";
import { lessonPreferencesSchema } from "@/lib/schema";

export async function MediaAccordion({
  attemptId,
  type,
  className,
}: {
  attemptId: string;
  type: TaskType;
  className?: string;
}) {
  if (type !== "lesson") return null;
  const { configPreferences } = await db.botChatRouter.getPreferences({
    chatId: attemptId,
  });

  const preferences = lessonPreferencesSchema.safeParse(configPreferences);
  if (!preferences.success) return null;

  const { videos } = preferences.data;
  const noVideos = (videos && videos.length === 0) || !videos;
  if (noVideos) return null;

  return (
    <Accordion
      type="single"
      collapsible
      className={cn("rounded-xl", className)}
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="rounded-2xl bg-purple-900 px-2 py-2 font-bold text-secondary/80 hover:no-underline data-[state=open]:rounded-b-none [&[data-state=closed]>svg]:text-purple-200">
          <div className="flex flex-row items-center space-x-2 text-purple-200">
            <MediaIcon size="sm" />
            <span>Media</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="rounded-bl-xl bg-base-100 bg-gradient-to-r from-purple-900/60 to-slate-800  px-2 py-2">
          <VideoList videos={videos} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const VideoList = ({
  videos,
}: {
  videos: Array<z.infer<typeof videoSchema>>;
}) => {
  return (
    <div className="scrollbar-hide flex gap-4 overflow-y-scroll">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} />
      ))}
    </div>
  );
};
