"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Avatar from "@/components/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-btn";

export function ProfileDropdown({ profileLink }: { profileLink: string }) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <div className="flex w-full items-center space-x-2 p-2">
          <Avatar />
          <div className="truncate text-xs">{user?.email}</div>
          <ChevronUpIcon className={cn("h-5 w-5")} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-56 bg-base-300" side="top">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={profileLink}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
