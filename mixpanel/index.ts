import mixpanel from "mixpanel";

const mp = mixpanel.init(
  process.env.NODE_ENV === "production"
    ? process.env.MIXPANEL_TOKEN ?? ""
    : process.env.DEV_MIXPANEL_TOKEN ?? "",
  { track_pageview: true }
);

export { mp };

//TODO Add production token for mixpanel in env
