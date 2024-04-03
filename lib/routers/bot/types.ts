import { getBotsByTeacherAndStudentID } from "./router";
import { UnwrapPromise } from "../../../app/dragon/student/queries";

export type BotsByTeacherAndStudentID = UnwrapPromise<
  ReturnType<typeof getBotsByTeacherAndStudentID>
>;
