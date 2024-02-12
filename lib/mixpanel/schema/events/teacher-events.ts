import { CommonEventProperties as CommonEvents } from "./common-events";
import { TaskType } from "@/types";

// --- Task Events ---

type BaseTaskProperties = {
  task_type: TaskType;
  task_id: string;
  class_id: string;
};

type TaskEvents = {
  task_created: BaseTaskProperties;
  task_parsed: BaseTaskProperties;
  task_parsing_failed: BaseTaskProperties;
  task_published: BaseTaskProperties; //Implemented
  task_unpublished: BaseTaskProperties; //Implemented
  task_publishing_failed: BaseTaskProperties & {
    isError: true;
  }; //Implemented
  report_opened: BaseTaskProperties;
  task_unpublishing_failed: BaseTaskProperties & {
    isError: true;
  }; //Implemented
};

// --- Task Checking Events ---

type TestingEvents = {
  test_started: {
    test_id: string;
  };
  check_message_sent: {
    message_id: string;
  };
  check_suggestion_used: {
    suggestion_id: string;
  };
  check_textToSpeech_used: {};
  check_speechToText_used: {};
};

// --- Class Events ---

type BaseClassProperties = {
  class_id: string;
  grade: string;
  board: string;
};

type ClassEvents = {
  class_created: BaseClassProperties;
  student_added: BaseClassProperties & {
    student_email: string;
    student_name: string;
  };
  student_removed: BaseClassProperties & {
    student_email: string;
    student_name: string;
  };
  student_invited: BaseClassProperties & {
    student_email: string;
    student_name: string;
  };
};

// --- Avatar Events ---
type BaseAvatarProperties = {};

type AvatarEvents = {
  avatar_created: BaseAvatarProperties;
  avatar_updated: BaseAvatarProperties;
};

export type TeacherEventProperties = CommonEvents &
  TaskEvents &
  ClassEvents &
  AvatarEvents;
