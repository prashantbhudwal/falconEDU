import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/prisma";
import { User } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import { AuthOptions } from "next-auth";

// Assign trial user properties
const assignTrialUserProperties = async () => {
  const trialStartDate = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialStartDate.getDate() + 3);

  return {
    role: "TRIAL",
    userType: "TEACHER",
    subscriptionStart: trialStartDate,
    subscriptionEnd: trialEndDate,
  };
};

// Find or create profile for a Google user
const googleProfileHandler = async (profile: any, tokens: any) => {
  const existingUser: User | null = await prisma.user.findUnique({
    where: { email: profile.email },
  });

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

// Session callback to set session data
const sessionCallback = ({ session, user }: any) => {
  if (user) {
    session.user.role = user.role;
    session.user.subscriptionStart = user.subscriptionStart;
    session.user.subscriptionEnd = user.subscriptionEnd;
  }
  return session;
};

// The main handler
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [GoogleProvider()],
  callbacks: {
    session: sessionCallback,
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
