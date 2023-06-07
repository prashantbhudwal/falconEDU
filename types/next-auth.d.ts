import { Session } from "next-auth";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & { id: number };
  }

  interface User {
    id: number;
  }

  interface JWT {
    id: number;
  }
}
