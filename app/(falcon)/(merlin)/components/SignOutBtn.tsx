"use client";

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <button className={className} onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
