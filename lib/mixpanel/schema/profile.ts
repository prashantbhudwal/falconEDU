import { UserType } from "@prisma/client";

type ReservedProperties = {
  $name: string;
  $email: string;
  $phone?: string;
  $avatar?: string;
  $created?: string;
};

export type ProfileProperties = ReservedProperties & {
  userType: UserType;
};
