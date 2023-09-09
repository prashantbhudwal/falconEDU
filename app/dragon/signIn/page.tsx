"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div>
      Sign In
      <Button
        onClick={() =>
          signIn(
            "google-student",
            { callbackUrl: "/dragon/create" },
            {
              userType: "student",
            }
          )
        }
      >
        Sign In
      </Button>
    </div>
  );
}
