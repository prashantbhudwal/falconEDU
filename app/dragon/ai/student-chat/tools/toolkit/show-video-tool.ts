import * as z from "zod";
import { createToolWithCallback } from "../tool-creator";
import { UnwrapPromise } from "next/dist/lib/coalesced-function";

export async function showVideoCallback(url: string) {
  return { video: url };
}

export type ShowVideo = UnwrapPromise<ReturnType<typeof showVideoCallback>>;

const schema = z.object({
  url: z.string().url().describe("The URL of the video to show"),
  isRightTimeToShow: z
    .boolean()
    .describe("Whether it is the right time to show the video"),
  whyIsRightTimeToShow: z
    .string()
    .describe("Why is it the right time to show the video"),
});

export const showVideo = createToolWithCallback({
  name: "show_video",
  description:
    "Use this function when the time is right to show the video to the student. Don't use this function if the time is not right. Don't use this function with every message. Use it only when the time is right.",
  schema,
  callback: showVideoCallback,
  type: "function",
});
