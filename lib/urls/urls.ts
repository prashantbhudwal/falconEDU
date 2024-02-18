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

export const getResourcesURL = (classId: string) =>
  `${baseUrl}/teacher/class/${classId}/resources`;

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
  let route;
  if (type === "test") {
    route = "test";
  } else if (type === "lesson") {
    route = "lesson";
  } else if (type === "ai-test") {
    route = "ai-test";
  } else {
    route = "bot";
  }
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

// Student Urls ---------------------------------------

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

export const getStudentTaskReportURL = ({
  botId,
  chatId,
}: {
  botId: string;
  chatId: string;
}) => `${baseUrl}/student/bot/${botId}/chat/${chatId}/report`;

//API urls ---------------------------------------
export const getStudentChatApiURL = () => `${baseUrl}/ai/student-chat`;
export const getParentChatApiURL = () => `${baseUrl}/ai/parent-chat`;

//Parent urls ---------------------------------------
export const parentHomeURL = `${baseUrl}/parent/`;
export const getParentReportUrlByTaskId = ({ taskId }: { taskId: string }) => {
  return `${baseUrl}/parent/report/${taskId}`;
};

//Org Admin urls ---------------------------------------
export const orgAdminHomeURL = `${baseUrl}/org-admin/`;
export const orgAdminProfileURL = `${baseUrl}/org-admin/profile`;
export const orgAdminOrgSettingsURL = `${baseUrl}/org-admin/org-settings`;

export const getManageTeachersURL = (orgId: string) =>
  `${baseUrl}/org-admin/manage/${orgId}/teachers`;
export const getManageStudentsURL = (orgId: string) =>
  `${baseUrl}/org-admin/manage/${orgId}/students`;
export const getManageAdminsURL = (orgId: string) =>
  `${baseUrl}/org-admin/manage/${orgId}/admins`;
export const getManageOrgURL = (orgId: string) =>
  `${baseUrl}/org-admin/manage/${orgId}/org`;

export const url = {
  teacher: {
    class: ({ classId }: { classId: string }) =>
      `${baseUrl}/teacher/class/${classId}`,
    resources: ({ classId }: { classId: string }) =>
      `${baseUrl}/teacher/class/${classId}/resources`,
    editResource: ({
      classId,
      resourceId,
    }: {
      classId: string;
      resourceId: string;
    }) => `${baseUrl}/teacher/class/${classId}/resources/edit/${resourceId}`,
  },
  student: {
    home: `${baseUrl}/student/`,
    profile: `/profile/student`,
    preferences: `${baseUrl}/student/preferences`,
    chat: (chatId: string) => `${baseUrl}/student/chat/${chatId}`,
    bot: (botId: string) => `${baseUrl}/student/bot/${botId}`,
    teacher: (teacherId: string) => `${baseUrl}/student/teacher/${teacherId}`,
    botChat: ({ botId, chatId }: { botId: string; chatId: string }) =>
      `${baseUrl}/student/bot/${botId}/chat/${chatId}`,
    taskReport: ({ botId, chatId }: { botId: string; chatId: string }) =>
      `${baseUrl}/student/bot/${botId}/chat/${chatId}/result`,
  },
  parent: {
    home: `${baseUrl}/parent/`,
    report: (taskId: string) => `${baseUrl}/parent/report/${taskId}`,
  },
  orgAdmin: {
    home: `${baseUrl}/org-admin/`,
    profile: `${baseUrl}/org-admin/profile`,
    orgSettings: `${baseUrl}/org-admin/org-settings`,
    manage: {
      teachers: (orgId: string) =>
        `${baseUrl}/org-admin/manage/${orgId}/teachers`,
      students: (orgId: string) =>
        `${baseUrl}/org-admin/manage/${orgId}/students`,
      admins: (orgId: string) => `${baseUrl}/org-admin/manage/${orgId}/admins`,
      org: (orgId: string) => `${baseUrl}/org-admin/manage/${orgId}/org`,
    },
  },
};
