import { UserType } from "@prisma/client";

export type CommonEventProperties = {
  app_opened: {};
  app_closed: {};
  page_viewed: {
    page: string;
  };
  account_created: {
    name: string;
    userType: UserType;
  };
};
