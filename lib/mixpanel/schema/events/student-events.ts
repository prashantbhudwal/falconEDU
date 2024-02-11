import { TaskType } from "@/types";
import { CommonEventProperties as CommonEvents } from "./common-events";
import { Grade, Language } from "@prisma/client";

// --- Task Events ---
type BaseTaskProperties = {
  task_type: TaskType;
  task_id: string;
  attempt_id: string;
};

type TaskEvents = {
  task_viewed: BaseTaskProperties;
  task_started: BaseTaskProperties;
  task_submitted: BaseTaskProperties;
  result_viewed: BaseTaskProperties;
};

// --- Avatar Events ---
type AvatarEvents = {
  avatar_created: {};
  avatar_updated: {};
};

// --- Chat Events ---
type ChatEvents = {
  textToSpeech_used: {};
  speechToText_used: {};
  message_sent: {
    message_id: string;
  };
  chat_suggestion_used: {};
};

export type StudentEventProperties = CommonEvents &
  TaskEvents &
  AvatarEvents &
  ChatEvents & {
    teacher_viewed: {
      user_id: string;
      teacher_id: string;
    };
  };
