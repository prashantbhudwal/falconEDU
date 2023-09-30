import Link from "next/link";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";

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

export function StudentBotNavbar() {}

export function StudentTextNavbar() {}

function StudentNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="navbar h-2 bg-base-200 shadow-sm shadow-base-100">
      {children}
    </div>
  );
}
