import { UnwrapPromise } from "../../helpers";
import { getClassByBotId } from "./router";

export type GetClassByBotId = UnwrapPromise<ReturnType<typeof getClassByBotId>>;
