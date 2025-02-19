import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/prisma";
import { User as PrismaUser } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import { AuthOptions } from "next-auth";
import { User, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { redirect } from "next/navigation";
import { createUserProfile } from "./mutations";
import { UserType } from "@prisma/client";
import { createMixpanelProfile } from "@/lib/mixpanel";

const TRIAL_DURATION = 14;

// Assign trial user properties
const assignTrialUserProperties = async (userType: UserType) => {
  const trialStartDate = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialStartDate.getDate() + TRIAL_DURATION);

  return {
    role: "TRIAL",
    userType: userType,
    subscriptionStart: trialStartDate,
    subscriptionEnd: trialEndDate,
  };
};

const handleProfile = async (profile: any, token: any, userType: UserType) => {
  const existingUser: PrismaUser | null = await prisma.user.findUnique({
    where: { email: profile.email },
  });
  if (existingUser && existingUser.userType !== userType) {
    throw new Error("User type mismatch");
  }
  if (existingUser) {
    const { sub, ...profileWithoutSub } = profile;
    return {
      id: profile.sub,
      ...profileWithoutSub,
    };
  } else {
    // Set trial user properties for new users
    const trialUserProperties = await assignTrialUserProperties(userType);
    return {
      id: profile.sub, // Google returns the id as 'sub'
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      ...trialUserProperties,
    };
  }
};

// Find or create profile for a Google user
const googleProfileHandlerStudent = async (profile: any, tokens: any) => {
  return handleProfile(profile, tokens, "STUDENT");
};

const googleProfileHandlerTeacher = async (profile: any, tokens: any) => {
  return handleProfile(profile, tokens, "TEACHER");
};

const googleProfileHandlerParent = async (profile: any, tokens: any) => {
  return handleProfile(profile, tokens, "PARENT");
};
const googleProfileHandlerOrgAdmin = async (profile: any, tokens: any) => {
  return handleProfile(profile, tokens, "ORG_ADMIN");
};

// Provider for Google authentication
const GoogleTeacherProvider = () => {
  return Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    profile: googleProfileHandlerTeacher,
    authorization: {
      params: {
        prompt: "select_account",
        access_type: "offline",
        response_type: "code",
      },
    },
  });
};

const GoogleStudentProvider = () => {
  return Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    profile: googleProfileHandlerStudent,
    id: "google-student",
    name: "google-student",
    authorization: {
      params: {
        prompt: "select_account",
        access_type: "offline",
        response_type: "code",
      },
    },
  });
};

const GoogleParentProvider = () => {
  return Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    profile: googleProfileHandlerParent,
    id: "google-parent",
    name: "google-parent",
    authorization: {
      params: {
        prompt: "select_account",
        access_type: "offline",
        response_type: "code",
      },
    },
  });
};

const GoogleOrgAdminProvider = () => {
  return Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    profile: googleProfileHandlerOrgAdmin,
    id: "google-org-admin",
    name: "google-org-admin",
    authorization: {
      params: {
        prompt: "select_account",
        access_type: "offline",
        response_type: "code",
      },
    },
  });
};

// JWT callback to store the user properties
const jwtCallback = async ({
  token,
  user,
  account,
  isNewUser,
  profile,
  trigger,
  session,
}: {
  token: JWT;
  user: User | null;
  account: Account | null;
  profile?: Profile;
  trigger?: "update" | "signIn" | "signUp";
  isNewUser?: boolean;
  session?: any;
}): Promise<any> => {
  //
  //
  //
  //

  if (user) {
    token.id = user.id;
    token.role = user.role;
    token.subscriptionStart = user.subscriptionStart;
    token.subscriptionEnd = user.subscriptionEnd;
    token.userType = user.userType;
  }

  if (user && isNewUser) {
    try {
      await createUserProfile(user.id, user.userType);
      await createMixpanelProfile(user.email as string, {
        $email: user.email as string,
        $name: user.name ?? "Unknown",
        $avatar: user.image ?? undefined,
        userType: user.userType as UserType,
      });
    } catch (e) {
      return false;
    }
  }
  //
  return token;
};

// Session callback to set session data
const sessionCallback = async ({
  session,
  token,
}: {
  session: any;
  token: any;
}) => {
  //
  //

  if (token) {
    session.user.id = token.sub; // Add the user ID here
    session.user.role = token.role;
    session.user.subscriptionStart = token.subscriptionStart;
    session.user.subscriptionEnd = token.subscriptionEnd;
    session.user.userType = token.userType;
  }
  //

  return session;
};

// The main handler
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleTeacherProvider(),
    GoogleStudentProvider(),
    GoogleParentProvider(),
    GoogleOrgAdminProvider(),
  ],
  callbacks: {
    signIn: async ({ account, user, credentials, email, profile }) => {
      return true;
    },
    jwt: jwtCallback,
    session: sessionCallback,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/",
  },
};
