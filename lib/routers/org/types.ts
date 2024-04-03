import { UnwrapPromise } from "@/lib/routers/helpers";
import {
  getOrgAdminsInOrg,
  getStudentsInOrg,
  getTeachersInOrg,
} from "./router";
export type TeachersInOrg = UnwrapPromise<ReturnType<typeof getTeachersInOrg>>;
export type StudentsInOrg = UnwrapPromise<ReturnType<typeof getStudentsInOrg>>;
export type OrgAdminsInOrg = UnwrapPromise<
  ReturnType<typeof getOrgAdminsInOrg>
>;
