import { revalidatePath } from "next/cache";
import * as botConfig from "./botConfigRouter";
import * as classRouter from "./classRouter";

export const db = {
  botConfig,
  class: classRouter,
};
