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
  task_viewed: BaseTaskProperties; // Implemented
  task_started: BaseTaskProperties;
  task_submitted: BaseTaskProperties; // Implemented
  result_viewed: BaseTaskProperties; // Implemented
  task_submission_failed: BaseTaskProperties; // Implemented
};

// --- Avatar Events ---
type AvatarEvents = {
  avatar_created: {};
  avatar_updated: {};
};

// --- Chat Events ---

type BaseChatProperties = {
  taskType: TaskType;
  attemptId: string;
  model: string;
  temperature: number;
};

type ChatEvents = {
  textToSpeech_used: {};
  speechToText_used: {};
  message_sent: BaseChatProperties;
  tool_used: BaseChatProperties & {
    tool_name: string;
  }; // Implemented
  chat_suggestion_used: {};
  chat_completion_failed: BaseChatProperties & {
    isError: boolean;
  }; // Implemented
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
