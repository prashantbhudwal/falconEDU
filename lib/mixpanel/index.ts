"use server";
import { PropertyDict } from "mixpanel";
import { mp } from "./init";
import { UserEventProperties, UserType } from "./schema/events";
import { ProfileProperties } from "./schema/profile";
import pRetry from "p-retry";

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
  userType: U,
  eventName: E,
  properties: EventProperties<U, E>,
) {
  const eventFullName = `${eventName as string}`;
  const run = async () => {
    await mp.track(eventFullName, properties as PropertyDict);
  };

  await pRetry(run, {
    retries: 3,
  });
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
