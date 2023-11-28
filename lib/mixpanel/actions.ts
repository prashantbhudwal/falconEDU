"use server";

import { mp } from ".";
export const trackPage = (pageName: string, distinct_id: string) => {
  mp.track("Page View", { page: pageName, distinct_id });
};
