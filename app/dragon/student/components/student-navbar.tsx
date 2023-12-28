"use client";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { ReactNode } from "react";
import SignOutButton from "@/components/auth/sign-out-btn";
import Image from "next/image";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import {
  getStudentPreferencesURL,
  studentHomeURL,
  studentProfileURL,
} from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import router from "next/navigation";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/theme-toggle";

const SettingsIcon: React.FC = () => {
  return (
    <div className="dropdown-end dropdown">
      <label tabIndex={0}>
        <Cog8ToothIcon className="h-6 w-6 text-text-500" />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-32 bg-base-100 p-2 shadow"
      >
        <li>
          <Link href={studentProfileURL}>My Profile</Link>
          <SignOutButton />
        </li>
        <li className="flex items-center gap-2">
          <ModeToggle />
        </li>
      </ul>
    </div>
  );
};

type StudentNavbarProps = {
  children: ReactNode;
};

export const StudentNavbar: React.FC<StudentNavbarProps> = ({ children }) => (
  <div className="bg-base-200 shadow-sm shadow-base-100 navbar">{children}</div>
);

export const StudentHomeNavbar: React.FC = () => (
  <StudentNavbar>
    <div className="flex gap-3 navbar-start">
      <Image src={"/chubbi.png"} height={30} width={30} alt="Falcon Logo" />
      <p className="text-xl">FalconAI</p>
    </div>
    <div className="navbar-end flex items-center gap-2">
      <Link href={getStudentPreferencesURL()}>
        <Button variant="ghost" size={"sm"}>
          My Profile
        </Button>
      </Link>
      <SettingsIcon />
    </div>
  </StudentNavbar>
);

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
}) => {
  return (
    <StudentNavbar>
      <Link href={studentHomeURL} className="flex gap-3 navbar-start">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-base-300">
            <Avvvatars value={title} style="shape" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="truncate">{title}</p>
          <p className="text-sm text-text-500 truncate">{subtitle}</p>
        </div>
      </Link>
      <div className="navbar-end flex gap-4">
        {button}
        <SettingsIcon />
      </div>
    </StudentNavbar>
  );
};
