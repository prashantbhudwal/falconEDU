import { Grade } from "@prisma/client";
import { CommonEventProperties as CommonEvents } from "./common-events";
import { TaskType } from "@/types";

type ErrorProperties = {
  isError: true;
};

// --- Task Events ---

type BaseTaskProperties = {
  task_type: TaskType;
  task_id: string;
  class_id: string;
};

type TaskEvents = {
  task_created: BaseTaskProperties; //Implemented
  task_creation_failed: BaseTaskProperties & ErrorProperties; //Implemented
  task_content_parsed: BaseTaskProperties;
  task_content_parsing_failed: BaseTaskProperties & ErrorProperties;
  task_published: BaseTaskProperties; //Implemented
  task_unpublished: BaseTaskProperties; //Implemented
  task_publishing_failed: BaseTaskProperties & ErrorProperties; //Implemented
  report_opened: BaseTaskProperties;
  task_unpublishing_failed: BaseTaskProperties & ErrorProperties; //Implemented
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
};

type ClassEvents = {
  class_created: BaseClassProperties & {
    grade: Grade;
    section?: string;
  }; //Implemented
  student_added: BaseClassProperties & {
    student_email: string;
  }; //Implemented
  student_removed: BaseClassProperties & {
    student_email: string;
  }; //Implemented
  student_invited: BaseClassProperties & {
    student_email: string;
  }; //Implemented
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
  AvatarEvents &
  TestingEvents;
