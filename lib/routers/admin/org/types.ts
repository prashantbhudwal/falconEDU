import { UnwrapPromise } from "@/lib/routers/helpers";
import { getTeachersWithUserId } from "./router";
export type TeachersInOrg = UnwrapPromise<
  ReturnType<typeof getTeachersWithUserId>
>;
