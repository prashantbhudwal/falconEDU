"use client";
import { signOut, useSession } from "next-auth/react";

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  const { data: session } = useSession();

  const handleSignOut = () => {
    let redirectUrl = "/"; // Default redirect URL

    // Determine redirect URL based on user type
    if (session && session.user) {
      switch (session.user.userType) {
        case "STUDENT":
          redirectUrl = "/dragon/auth/student";
          break;
        case "TEACHER":
          redirectUrl = "/dragon/auth/teacher";
          break;
        case "PARENT":
          redirectUrl = "/dragon/auth/parent";
          break;
        case "ORG_ADMIN":
          redirectUrl = "/dragon/auth/org-admin";
          break;
        default:
          redirectUrl = "/";
      }
    }

    signOut({ redirect: false }).then(() => {
      // Perform the redirection after successful sign-out
      window.location.href = redirectUrl;
    });
  };

  return (
    <button className={className} onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
