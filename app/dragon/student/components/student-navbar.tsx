import Link from "next/link";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { ReactNode } from "react";
import SignOutButton from "@/components/auth/sign-out-btn";
import Image from "next/image";

const SettingsIcon: React.FC = () => (
  <div className="dropdown-end dropdown">
    <label tabIndex={0}>
      <Cog8ToothIcon className="h-6 w-6 text-slate-500" />
    </label>
    <ul
      tabIndex={0}
      className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-32 bg-base-100 p-2 shadow"
    >
      <li>
        <SignOutButton />
      </li>
    </ul>
  </div>
);

type StudentNavbarProps = {
  children: ReactNode;
};

const StudentNavbar: React.FC<StudentNavbarProps> = ({ children }) => (
  <div className="bg-base-200 shadow-sm shadow-base-100 navbar flex justify-between w-full place-items-center px-2">
    {children}
  </div>
);

export const StudentHomeNavbar: React.FC = () => (
  <StudentNavbar>
    <div className="flex gap-2">
      <Image src={"/chubbi.png"} height={25} width={25} alt="Falcon Logo" />
      <p className="text-xl">FalconAI</p>
    </div>
    <SettingsIcon />
  </StudentNavbar>
);

type AvatarSectionProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  fallbackValue: string;
};

const AvatarSection: React.FC<AvatarSectionProps> = ({
  title,
  subtitle,
  avatarUrl,
  fallbackValue,
}) => (
  <div className="flex gap-5">
    <Avatar>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback className="bg-base-300">
        <Avvvatars value={fallbackValue} style="shape" />
      </AvatarFallback>
    </Avatar>
    <div>
      <p className="truncate">{title}</p>
      <p className="text-sm text-slate-500 truncate">{subtitle}</p>
    </div>
  </div>
);

type StudentBotNavbarProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
};

export const AvatarNavbar: React.FC<StudentBotNavbarProps> = ({
  title,
  subtitle,
  avatarUrl,
}) => (
  <StudentNavbar>
    <AvatarSection
      title={title}
      subtitle={subtitle}
      avatarUrl={avatarUrl}
      fallbackValue={title}
    />
    <SettingsIcon />
  </StudentNavbar>
);
