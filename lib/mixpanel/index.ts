"use server";
import { mp } from "./init";
import { UserEventProperties, UserType } from "./schema/events";
import { ProfileProperties } from "./schema/profile";

export const trackPage = (pageName: string, distinct_id: string) => {
  mp.track("Page View", { page: pageName, distinct_id });
};

type EventNames<U extends UserType> = keyof UserEventProperties[U];

// Helper type to infer event properties based on user type and event name
type EventProperties<
  U extends UserType,
  E extends EventNames<U>,
> = UserEventProperties[U][E];

// Generic tracking function that enforces user type, event names, and event properties correlation
export async function trackEvent<U extends UserType, E extends EventNames<U>>(
  eventName: E,
  properties: EventProperties<U, E>,
): Promise<void> {
  const eventFullName = `${eventName as string}`;
  console.log("Tracking event", eventFullName, properties);

  // mp.track(eventFullName, properties as PropertyDict);
}

export async function createMixpanelProfile(
  distinct_id: string,
  properties: ProfileProperties,
): Promise<void> {
  mp.people.set_once(distinct_id, properties);
}

export async function updateMixpanelProfile(
  distinct_id: string,
  properties: ProfileProperties,
): Promise<void> {
  mp.people.set(distinct_id, properties);
}
