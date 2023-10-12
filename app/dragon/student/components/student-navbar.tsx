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
    <div className="flex gap-3">
      <Image src={"/chubbi.png"} height={30} width={30} alt="Falcon Logo" />
      <p className="text-xl">FalconAI</p>
    </div>
    <SettingsIcon />
  </StudentNavbar>
);

type AvatarNavbarProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
};

export const AvatarNavbar: React.FC<AvatarNavbarProps> = ({
  title,
  subtitle,
  avatarUrl,
}) => (
  <StudentNavbar>
    <div className="flex gap-3">
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-base-300">
          <Avvvatars value={title} style="shape" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="truncate">{title}</p>
        <p className="text-sm text-slate-500 truncate">{subtitle}</p>
      </div>
    </div>
    <SettingsIcon />
  </StudentNavbar>
);
