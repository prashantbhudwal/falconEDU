import { TaskType } from "@/types/dragon";

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
  } else {
    return `${baseUrl}/teacher/class/${classId}/${taskId}/test`;
  }
};

export const getEditBotURL = (classId: string, botId: string) =>
  `${baseUrl}/teacher/class/${classId}/${botId}/bot`;
export const getTestEditBotURL = (classId: string, botId: string) =>
  `${baseUrl}/teacher/class/${classId}/${botId}/test`;

export const getTestReportUrl = ({
  classId,
  testId,
  studentBotId,
}: {
  classId: string;
  testId: string;
  studentBotId: string;
}) =>
  `${baseUrl}/teacher/class/${classId}/${testId}/test/report/${studentBotId}`;

export const getReportUrl = ({
  classId,
  testId,
  studentBotId,
  type,
}: {
  classId: string;
  testId: string;
  studentBotId: string;
  type: string;
}) => {
  const route = type === "test" ? "test" : "bot";
  return `${baseUrl}/teacher/class/${classId}/${testId}/${route}/responses/individual-response/${studentBotId}`;
};

export const getTaskUrlByType = ({
  classId,
  configId,
  type,
}: {
  classId: string;
  configId: string;
  type: string;
}) => {
  if (type === "chat") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/bot`;
  } else if (type === "test") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/test`;
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
  type: string;
}) => {
  if (type === "chat") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/bot/responses`;
  } else if (type === "test") {
    return `${baseUrl}/teacher/class/${classId}/${configId}/test/responses`;
  } else {
    return `${baseUrl}/teacher/class/${classId}/${configId}/test/responses`;
  }
};

// Student Url
export const studentHomeURL = `${baseUrl}/student/`;

//TODO This url pattern is not consistent with other urls
export const studentProfileURL = `/profile/student`;
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
