import { UnwrapPromise } from "@/app/dragon/student/queries";
import { getOrgAdminsInOrg, getStudentsInOrg, getTeachersInOrg } from "./router";
export type TeachersInOrg = UnwrapPromise<ReturnType<typeof getTeachersInOrg>>;
export type StudentsInOrg = UnwrapPromise<ReturnType<typeof getStudentsInOrg>>;
export type OrgAdminsInOrg = UnwrapPromise<
  ReturnType<typeof getOrgAdminsInOrg>
>;