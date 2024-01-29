import { TaskType } from "@/types/dragon";
import { el } from "date-fns/locale";

// Dragon urls
const baseUrl = `/dragon`;
export const getTeacherHomeURL = () => `${baseUrl}/teacher/`;
export const getClassesURL = () => `${baseUrl}/classes`;
export const getClassURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}`;
export const getBotsURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/bots`;
export const getStudentsURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/students`;
export const getTestsUrl = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/tests`;

export const getSettingsUrl = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/dashboard`;

export const teacherProfileURL = `${getTeacherHomeURL()}/profile`;
export const teacherTrainingURL = `${getTeacherHomeURL()}/teacher-training/gallery`;
export const teacherAvatarURL = `${getTeacherHomeURL()}/teacher-preferences/`;
export const teacherAIToolsURL = `/preferences/`;
export const getTaskUrl = ({
  classId,
  taskId,
  type,
}: {
  classId: string;
  taskId: string;
  type: TaskType;
}) => {
  if (type === "chat") {
    return `${baseUrl}/teacher/class/${classId}/${taskId}/bot`;
  } else if (type === "test") {
    return `${baseUrl}/teacher/class/${classId}/${taskId}/test`;
  } else if (type === "lesson") {
    return `${baseUrl}/teacher/class/${classId}/${taskId}/lesson`;
  } else if (type === "ai-test") {
    return `${baseUrl}/teacher/class/${classId}/${taskId}/ai-test`;
  } else {
    return `${baseUrl}/teacher/class/${classId}/${taskId}/test`;
  }
};

export const getReportUrl = ({
  classId,
  testId,
  attemptId,
  type,
}: {
  classId: string;
  testId: string;
  attemptId: string;
  type: TaskType;
}) => {
  const route =
    type === "test"
      ? "test"
      : type === "lesson"
        ? "lesson"
        : type === "ai-test"
          ? "ai-test"
          : "bot";
  return `${baseUrl}/teacher/class/${classId}/${testId}/${route}/responses/individual-response/${attemptId}`;
};

export const getReportUrlWithAttempts = ({
  classId,
  testId,
  studentBotId,
  type,
  attemptId,
}: {
  classId: string;
  testId: string;
  studentBotId: string;
  type: TaskType;
  attemptId: string;
}) => {
  const route =
    type === "test"
      ? "test"
      : type === "lesson"
        ? "lesson"
        : type === "ai-test"
          ? "ai-test"
          : "bot";
  return `${baseUrl}/teacher/class/${classId}/${testId}/${route}/responses/individual-response/${studentBotId}/${attemptId}`;
};

export const getTaskUrlByType = ({
  classId,
  configId,
  type,
}: {
  classId: string;
  configId: string;
  type: TaskType;
}) => {
  if (type === "chat") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/bot`;
  } else if (type === "test") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/test`;
  } else if (type === "lesson") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/lesson`;
  } else if (type === "ai-test") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/ai-test`;
  } else {
    return `${baseUrl}/teacher/class/${classId}/${configId}/test`;
  }
};

export const getTaskResponsesUrlByType = ({
  classId,
  configId,
  type,
}: {
  classId: string;
  configId: string;
  type: TaskType;
}) => {
  if (type === "chat") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/bot/responses`;
  } else if (type === "test") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/test/responses`;
  } else if (type === "lesson") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/lesson/responses`;
  } else if (type === "ai-test") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/ai-test/responses`;
  } else {
    return `${baseUrl}/teacher/class/${classId}/${configId}/test/responses`;
  }
};

// Student Url
export const studentHomeURL = `${baseUrl}/student/`;

//TODO This url pattern is not consistent with other urls
export const studentProfileURL = `/profile/student`;
export const getStudentPreferencesURL = () => `${baseUrl}/student/preferences`;
export const studentChatURL = (chatId: string) =>
  `${baseUrl}/student/chat/${chatId}`;

export const getStudentBotURL = (botId: string) =>
  `${baseUrl}/student/bot/${botId}`;
export const getStudentTeacherURL = (teacherId: string) =>
  `${baseUrl}/student/teacher/${teacherId}`;

export const getStudentBotChatURL = (botId: string, chatId: string) =>
  `${baseUrl}/student/bot/${botId}/chat/${chatId}`;

//API urls
export const getStudentChatApiURL = () => `${baseUrl}/ai/student-chat`;
export const getParentChatApiURL = () => `${baseUrl}/ai/parent-chat`;

//Parent urls
export const parentHomeURL = `${baseUrl}/parent/`;
export const getParentReportUrlByTaskId = ({ taskId }: { taskId: string }) => {
  return `${baseUrl}/parent/report/${taskId}`;
};

//Org Admin urls
export const orgAdminHomeURL = `${baseUrl}/org-admin/`;
export const orgAdminProfileURL = `${baseUrl}/org-admin/profile`;
export const orgAdminOrgSettingsURL = `${baseUrl}/org-admin/org-settings`;
export const manageTeachersURL = `${baseUrl}/org-admin/teachers`;
export const manageStudentsUrl = `${baseUrl}/org-admin/students`;
export const manageOrgURL = `${baseUrl}/org-admin/org`;
export const manageAdminsURL = `${baseUrl}/org-admin/admins`;
