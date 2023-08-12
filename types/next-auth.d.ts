import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscriptionStart: Date;
      subscriptionEnd: Date;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    subscriptionStart: Date;
    subscriptionEnd: Date;
  }
}
