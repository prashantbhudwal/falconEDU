import { revalidatePath } from "next/cache";
import * as botConfig from "./botConfigRouter";
import * as classRouter from "./classRouter";
import * as bot from "./botRouter";

export const db = {
  botConfig,
  class: classRouter,
  bot,
};
