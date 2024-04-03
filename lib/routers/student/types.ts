import { UnwrapPromise } from "../../../app/dragon/student/queries";
import { getTaskStats, getTasksWithInteractions } from "./router";
export type TypeGetTaskStats = UnwrapPromise<ReturnType<typeof getTaskStats>>;
export type TasksWithInteractions = UnwrapPromise<
  ReturnType<typeof getTasksWithInteractions>
>;