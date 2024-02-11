import { StudentEventProperties } from "./student-events";
import { TeacherEventProperties } from "./teacher-events";

export type UserType = "teacher" | "student";

type ReservedEventProperties = {
  distinct_id: string;
};

type WithDistinctId<T> = T & ReservedEventProperties;

type TeacherEventPropertiesWithDistinctID = {
  [P in keyof TeacherEventProperties]: WithDistinctId<
    TeacherEventProperties[P]
  >;
};

type StudentEventPropertiesWithDistinctID = {
  [P in keyof StudentEventProperties]: WithDistinctId<
    StudentEventProperties[P]
  >;
};

export type UserEventProperties = {
  teacher: TeacherEventPropertiesWithDistinctID;
  student: StudentEventPropertiesWithDistinctID;
};
