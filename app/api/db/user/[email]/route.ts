import { NextResponse } from "next/server";
import prisma from "@/prisma";
import {
  Teacher,
  IndividualSubscription,
  SchoolSubscription,
  IndividualPlanType,
  SchoolPlanType,
} from "@prisma/client"; // import these models from Prisma client
export interface UserProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  accountType: string;
  profile: { bio: string } | null;
  individualSub: {
    startDate: Date;
    endDate: Date;
    plan: IndividualPlanType;
  } | null;
  school: {
    subscriptions: {
      startDate: Date;
      endDate: Date;
      plan: SchoolPlanType;
    }[];
  } | null;
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { email: string };
  }
) {
  const email = params.email;
  let user: UserProfileData | null = await prisma.teacher.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      accountType: true,
      profile: {
        select: {
          bio: true,
        },
      },
      individualSub: {
        select: {
          id: true,
          teacherId: true,
          startDate: true,
          endDate: true,
          plan: true,
        },
      },
      school: {
        select: {
          subscriptions: {
            select: {
              id: true,
              schoolId: true,
              startDate: true,
              endDate: true,
              plan: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(user);
}
