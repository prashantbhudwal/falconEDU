// Dragon urls
const baseUrl = `/dragon`;
export const getClassesURL = () => `${baseUrl}/classes`;
export const getClassURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}`;
export const getBotsURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/bots`;
export const getStudentsURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/students`;
export const getResourcesURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/resources`;

export const getEditBotURL = (classId: string, botId: string) =>
  `${baseUrl}/teacher/class/${classId}/bots/edit-bot/${botId}`;

// Student Url
export const studentChatURL = (chatId: string) =>
  `${baseUrl}/student/chat/${chatId}`;
