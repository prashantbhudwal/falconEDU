import { UnwrapPromise } from "@/lib/routers/helpers";
import { getTeacherTasksWithTeacherId } from "./router";
export type TeacherTask = UnwrapPromise<
  ReturnType<typeof getTeacherTasksWithTeacherId>
>;
