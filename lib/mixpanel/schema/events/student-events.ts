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
  task_submission_failed: BaseTaskProperties & {
    isError: boolean;
  }; // Implemented
};

// --- Avatar Events ---
type AvatarEvents = {
  avatar_created: {};
  avatar_updated: {};
};

// --- Chat Events ---

type BaseChatProperties = {
  task_type: TaskType;
  attempt_id: string;
  model: string;
};

type ChatEvents = {
  textToSpeech_used: BaseChatProperties & {
    task_id: string;
    voice: string;
    speed: number;
  }; // Implemented
  speechToText_used: BaseChatProperties & {
    task_id: string;
  }; // Implemented
  message_sent: BaseChatProperties & {
    temperature: number;
  }; // Implemented
  tool_used: BaseChatProperties & {
    tool_name: string;
    temperature: number;
  }; // Implemented
  chat_suggestion_used: {};
  chat_completion_failed: BaseChatProperties & {
    isError: boolean;
    temperature: number;
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
