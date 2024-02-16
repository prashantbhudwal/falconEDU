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

const SettingsIcon: React.FC = () => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0}>
        <Cog8ToothIcon className="h-6 w-6 text-slate-500" />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-[1] mt-3 w-32 rounded-box bg-base-100 p-2 shadow"
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
  <div className="navbar bg-base-200 shadow-sm shadow-base-100">{children}</div>
);

export const StudentHomeNavbar = ({
  brandName,
}: {
  brandName?: string | null;
}) => {
  return (
    <StudentNavbar>
      <div className="navbar-start flex gap-2">
        <Image src={"/chubbi.png"} height={20} width={20} alt="Falcon Logo" />
        <div className="flex flex-row items-center gap-2">
          <div className="text-xs">FalconAI</div>
          {brandName && <XMarkIcon className="h-4 w-4 text-secondary" />}
          {brandName && <div className="text-xs">{brandName}</div>}
        </div>
      </div>
      <div className="navbar-end flex items-center gap-2">
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
  const [isLoading] = useAtom(chatIsLoadingAtom);
  return (
    <StudentNavbar>
      <Link href={studentHomeURL} className="navbar-start flex gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-base-300">
            <Avvvatars value={title} style="shape" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="truncate">{title}</p>
          {isLoading ? (
            <p className="truncate text-sm text-primary">
              <div className="flex flex-row items-baseline gap-1">
                <div>typing</div>
                <PulseLoader size={4} color={"#059669"} speedMultiplier={0.5} />
              </div>
            </p>
          ) : (
            <p className="truncate text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </Link>
      <div className="navbar-end flex gap-4">{button}</div>
    </StudentNavbar>
  );
};
