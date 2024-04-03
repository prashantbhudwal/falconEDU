import { UnwrapPromise } from "@/lib/routers/helpers";
import { getClassesByUserId, getStudentsByClassId } from "./router";
export type ClassesByUserId = UnwrapPromise<
  ReturnType<typeof getClassesByUserId>
>;
export type StudentsByClassId = UnwrapPromise<
  ReturnType<typeof getStudentsByClassId>
>;
