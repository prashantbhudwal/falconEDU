import { UnwrapPromise } from "../helpers";
import { byRecipient } from "./router";
export type NotificationsByRecipient = UnwrapPromise<
  ReturnType<typeof byRecipient>
>;
