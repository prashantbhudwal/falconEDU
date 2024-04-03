import { UnwrapPromise } from "../../helpers";
import { getTeachersByUserId } from "./router";

export type GetTeachersByUserId = UnwrapPromise<
  ReturnType<typeof getTeachersByUserId>
>;
