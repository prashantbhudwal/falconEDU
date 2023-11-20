import { revalidatePath } from "next/cache";
import * as botConfig from "./botConfigRouter";
import * as classRouter from "./classRouter";
import * as bot from "./botRouter";
import * as teacher from "./teacherRouter";

export const db = {
  botConfig,
  class: classRouter,
  bot,
  teacher,
};
