import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { User as PrismaUser } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import { AuthOptions } from "next-auth";
import { User, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";

const TRIAL_DURATION = 14;

// Assign trial user properties
const assignTrialUserProperties = async () => {
  const trialStartDate = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialStartDate.getDate() + TRIAL_DURATION);

  return {
    role: "TRIAL",
    userType: "TEACHER",
    subscriptionStart: trialStartDate,
    subscriptionEnd: trialEndDate,
  };
};

// Find or create profile for a Google user
const googleProfileHandler = async (profile: any, tokens: any) => {
  const existingUser: PrismaUser | null = await prisma.user.findUnique({
    where: { email: profile.email },
  });
  // console.log("ProfileTOken", tokens);

  if (existingUser) {
    const { sub, ...profileWithoutSub } = profile;
    return {
      id: profile.sub,
      ...profileWithoutSub,
    };
  } else {
    // Set trial user properties for new users
    const trialUserProperties = await assignTrialUserProperties();
    return {
      id: profile.sub, // Google returns the id as 'sub'
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      ...trialUserProperties,
    };
  }
};

// Provider for Google authentication
const GoogleProvider = () => {
  return Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    profile: googleProfileHandler,
  });
};

// JWT callback to store the user properties
const jwtCallback = async ({
  token,
  user,
  account,
}: {
  token: JWT;
  user: User | null;
  account: Account | null;
  profile?: Profile;
  trigger?: "update" | "signIn" | "signUp";
  isNewUser?: boolean;
  session?: any;
}): Promise<any> => {
  // console.log("token", token);
  if (user) {
    token.id = user.id;
    token.role = user.role;
    token.subscriptionStart = user.subscriptionStart;
    token.subscriptionEnd = user.subscriptionEnd;
  }
  // console.log("TokenM", token);
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
  // console.log("Session", session);
  // console.log("token", token);

  if (token) {
    session.user.id = token.sub; // Add the user ID here
    session.user.role = token.role;
    session.user.subscriptionStart = token.subscriptionStart;
    session.user.subscriptionEnd = token.subscriptionEnd;
  }
  // console.log("SessionM", session);

  return session;
};

// The main handler
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [GoogleProvider()],
  callbacks: {
    session: sessionCallback,
    jwt: jwtCallback,
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  jwt: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  pages: {
    signIn: "/",
  },
};
