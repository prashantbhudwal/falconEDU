import * as botConfig from "./botConfigRouter";
import * as classRouter from "./classRouter";
import * as bot from "./botRouter";
import * as teacher from "./teacherRouter";
import * as parseQuestionRouter from "./parsedQuestionRouter";
import * as inviteStudentsRouter from "./inviteStudentsRouter";
import * as studentRouter from "./studentRouter";
import * as attemptRouter from "./attempt";
import * as profileRouter from "./profileRouter";
import * as accountRouter from "./accountRouter";
import * as orgRouter from "./orgRouter";
import * as learningGoalsRouter from "./learningGoalsRouter";
import * as sourceRouter from "./sourceRouter";
import * as contextRouter from "./contextRouter";
import * as preferencesRouter from "./preferences";

export const db = {
  botConfig,
  class: classRouter,
  bot,
  teacher,
  parseQuestionRouter,
  inviteStudentsRouter,
  studentRouter,
  attempt: attemptRouter,
  profile: profileRouter,
  account: accountRouter,
  org: orgRouter,
  learningGoals: learningGoalsRouter,
  source: sourceRouter,
  context: contextRouter,
  preferences: preferencesRouter,
};
