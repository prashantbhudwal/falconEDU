type USER = "TEACHER" | "STUDENT" | "ADMIN" | "PARENT";
type ENTITY = "TASK" | "PROFILE";

type FalconNotification = {
  title: string;
  message: string;
  payload: {
    link: string;
  };
};

type TaskActions = "PUBLISH" | "SUBMIT";
type ProfileActions = "VIEW" | "SUBMIT";

type EntityActions = {
  TASK: TaskActions;
  PROFILE: ProfileActions;
};

type UserEntityActions = {
  [K in USER]?: {
    [E in ENTITY]?: Partial<Record<EntityActions[E], FalconNotification>>;
  };
};

const template: UserEntityActions = {
  TEACHER: {
    TASK: {
      PUBLISH: {
        title: "{teacherName} assigned a new {taskType}",
        message:
          "The submission date is {submissionDate}. Click here to view the task.",
        payload: {
          link: "https://falconai.com/teacher/tasks/123",
        },
      },
    },
    PROFILE: {
      VIEW: {
        title: "{teacherName} viewed your profile",
        message: "Click here to view their profile.",
        payload: {
          link: "https://falconai.com/teacher/profile/123",
        },
      },
    },
  },
  STUDENT: {
    TASK: {
      SUBMIT: {
        title: "{studentName} submitted a the {taskType}",
        message: "{taskName} was submitted. Click here to view the task.",
        payload: {
          link: "https://falconai.com/student/tasks/123",
        },
      },
    },
    PROFILE: {
      VIEW: {
        title: "{teacherName} viewed your profile",
        message: "Click here to view their profile.",
        payload: {
          link: "https://falconai.com/student/profile/123",
        },
      },
    },
  },
};
