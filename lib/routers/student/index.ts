import * as botChat from "./botChat";
import * as bot from "./bot";
import * as teacher from "./teacher";
import * as botConfig from "./botConfig";
import * as classRouter from "./class";

export const student = {
  botChat,
  bot,
  teacher,
  botConfig,
  class: classRouter,
};
