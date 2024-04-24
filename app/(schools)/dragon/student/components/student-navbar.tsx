"use client";
import { chatIsLoadingAtom } from "@/lib/atoms/student";
import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { ReactNode } from "react";
import SignOutButton from "@/components/auth/sign-out-btn";
import Image from "next/image";
import Link from "next/link";
import { PulseLoader } from "react-spinners";
import {
  getStudentPreferencesURL,
  studentHomeURL,
  studentProfileURL,
} from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { ModeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SettingsIcon: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Cog8ToothIcon className="h-6 w-6 text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={studentProfileURL}>My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <ModeToggle />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type StudentNavbarProps = {
  children: ReactNode;
  className?: string;
};

export const StudentNavbar: React.FC<StudentNavbarProps> = ({
  children,
  className,
}) => (
  <div className={cn("flex justify-between px-1.5 py-2 static ", className)}>
    {children}
  </div>
);

export const StudentHomeNavbar = ({
  brandName,
}: {
  brandName?: string | null;
}) => {
  return (
    <StudentNavbar>
      <div className="flex items-center gap-2">
        <Image src={"/chubbi.png"} height={20} width={20} alt="Falcon Logo" />
        <div className="flex flex-row items-center gap-2">
          <div className="text-xs">FalconAI</div>
          {brandName && <XMarkIcon className="h-4 w-4 text-secondary" />}
          {brandName && <div className="text-xs">{brandName}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={getStudentPreferencesURL()}>
          <Button variant="ghost" size={"sm"}>
            About Me
          </Button>
        </Link>
        <SettingsIcon />
      </div>
    </StudentNavbar>
  );
};

type AvatarNavbarProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  button?: ReactNode;
  timeLimit?: number;
  testBotId?: string;
  redirectUrl?: string;
  isSubmitted?: boolean;
  botChatId?: string;
  isMultipleChats?: boolean;
  hideAvatar?: boolean;
  className?: string;
};

export const AvatarNavbar: React.FC<AvatarNavbarProps> = ({
  title,
  subtitle,
  avatarUrl,
  button,
  timeLimit,
  testBotId,
  redirectUrl,
  isSubmitted,
  isMultipleChats,
  botChatId,
  hideAvatar,
  className,
}) => {
  const [isLoading] = useAtom(chatIsLoadingAtom);
  return (
    <StudentNavbar className={className}>
      <Link href={studentHomeURL} className="flex gap-3">
        {!hideAvatar && (
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-base-300">
              <Avvvatars value={title} style="shape" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn("", {
            "pl-2": hideAvatar,
          })}
        >
          <div className="truncate">{title}</div>
          {isLoading ? (
            <div className="truncate text-sm text-primary">
              <div className="flex flex-row items-baseline gap-1">
                <div>typing</div>
                <PulseLoader size={4} color={"#059669"} speedMultiplier={0.5} />
              </div>
            </div>
          ) : (
            <p className="truncate text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </Link>
      <div className="flex gap-4">{button}</div>
    </StudentNavbar>
  );
};
