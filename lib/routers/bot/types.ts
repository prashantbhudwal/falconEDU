import { getBotsByTeacherAndStudentID } from "./router";
import { UnwrapPromise } from "@/lib/routers/helpers";

export type BotsByTeacherAndStudentID = UnwrapPromise<
  ReturnType<typeof getBotsByTeacherAndStudentID>
>;
