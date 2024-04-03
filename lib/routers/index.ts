import * as botConfig from "./botConfig";
import * as classRouter from "./class";
import * as bot from "./bot";
import * as teacher from "./teacher";
import * as parseQuestionRouter from "./parsedQuestions";
import * as inviteStudentsRouter from "./inviteStudents";
import * as attemptRouter from "./attempt";
import * as profileRouter from "./profile";
import * as accountRouter from "./account";
import * as orgRouter from "./org";
import * as learningGoalsRouter from "./learningGoals";
import * as sourceRouter from "./source";
import * as contextRouter from "./context";
import * as preferencesRouter from "./preferences";
import * as notification from "./notification/router";
import { student } from "./student";
import * as test from "./tasks/test";
import { admin } from "./admin";

export const db = {
  // Teacher Routers:
  // TODO Will refactor to use the same pattern as student/admin later
  botConfig,
  class: classRouter,
  bot,
  teacher,
  parseQuestionRouter,
  inviteStudentsRouter,
  attempt: attemptRouter,
  profile: profileRouter,
  account: accountRouter,
  org: orgRouter,
  learningGoals: learningGoalsRouter,
  source: sourceRouter,
  context: contextRouter,
  preferences: preferencesRouter,
  notification: notification,
  test,
  // Other User Types
  student,
  admin,
};
