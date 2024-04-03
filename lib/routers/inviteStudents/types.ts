import { UnwrapPromise } from "@/lib/routers/helpers";
import { getInviteList } from "./router";
export type typeGetInviteList = UnwrapPromise<ReturnType<typeof getInviteList>>;
