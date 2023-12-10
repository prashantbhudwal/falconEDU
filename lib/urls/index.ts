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

export const getEditBotURL = (classId: string, botId: string) =>
  `${baseUrl}/teacher/class/${classId}/bots/edit-bot/${botId}`;
export const getTestEditBotURL = (classId: string, botId: string) =>
  `${baseUrl}/teacher/class/${classId}/tests/edit-test/${botId}`;

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
    return `${baseUrl}/teacher/class/${classId}/bots/edit-bot/${configId}`;
  } else if (type === "test") {
    return `${baseUrl}/teacher/class/${classId}/tests/edit-test/${configId}`;
  } else {
    return `${baseUrl}/teacher/class/${classId}/tests/edit-test/${configId}`;
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
