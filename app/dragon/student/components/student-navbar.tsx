import Link from "next/link";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";

export function StudentHomeNavbar() {
  return (
    <StudentNavbar>
      <div className="flex justify-between w-full">
        <div>
          <p className="text-xl">Falcon AI</p>
        </div>
        <div>
          <Link href="#">
            <Cog8ToothIcon className="h-6 w-6 text-slate-500" />
          </Link>
        </div>
      </div>
    </StudentNavbar>
  );
}

type StudentBotNavbarProps = {
  botName: string;
  TeacherName: string;
  avatarUrl?: string;
};

export function StudentBotNavbar({
  botName = "Albert Newton",
  TeacherName = "TestData",
  avatarUrl,
}: StudentBotNavbarProps) {
  return (
    <StudentNavbar>
      <div className="flex justify-between w-full">
        <div className="flex gap-5">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-base-300">
              <Avvvatars value={botName} style="shape" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl truncate">{botName}</p>
            <p className="text-sm text-slate-500 truncate">
              <span>by </span>
              {TeacherName}
            </p>
          </div>
        </div>
        <div>
          <Link href="#">
            <Cog8ToothIcon className="h-6 w-6 text-slate-500" />
          </Link>
        </div>
      </div>
    </StudentNavbar>
  );
}

type StudentBotItemNavbarProps = {
  botName: string;
  TeacherName: string;
  avatarUrl?: string;
};

export function StudentBotItemNav({
  botName = "Albert Newton",
  TeacherName = "Test data",
  avatarUrl,
}: StudentBotNavbarProps) {
  return (
    <StudentNavbar>
      <div className="flex justify-between w-full">
        <div className="flex gap-5">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-base-300">
              <Avvvatars value={botName} style="shape" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl truncate">{botName}</p>
            <p className="text-sm text-slate-500 truncate">
              <span>by </span>
              {TeacherName}
            </p>
          </div>
        </div>
        <div>
          <Link href="#">
            <Cog8ToothIcon className="h-6 w-6 text-slate-500" />
          </Link>
        </div>
      </div>
    </StudentNavbar>
  );
}

function StudentNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="navbar h-2 bg-base-200 shadow-sm shadow-base-100">
      {children}
    </div>
  );
}
