import { revalidatePath } from "next/cache";
import * as botConfig from "./botConfigRouter";
import * as classRouter from "./classRouter";
import * as bot from "./botRouter";
import * as teacher from "./teacherRouter";
import * as parseQuestionRouter from "./parsedQuestionRouter";
import * as inviteStudentsRouter from "./inviteStudentsRouter";
import * as studentRouter from "./studentRouter";
import * as botChatRouter from "./botChatRouter";

export const db = {
  botConfig,
  class: classRouter,
  bot,
  teacher,
  parseQuestionRouter,
  inviteStudentsRouter,
  studentRouter,
  botChatRouter,
};
