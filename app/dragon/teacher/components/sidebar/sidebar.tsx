import { NewClass } from "../new-class";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { teacherProfileURL } from "@/lib/urls";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "../../../../../lib/routers";
import { ProfileDropdown } from "./profile-dropdown";
import { SidebarChips } from "./sidebar-chips";

export async function Sidebar() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const { orgBrandName } = await db.org.getTeacherBrandNameByUserId({ userId });

  return (
    <nav className="col-span-4 grid h-screen w-full grid-cols-4 grid-rows-8 bg-base-200/50">
      <div className="col-span-4 row-span-1 row-start-1 flex flex-col space-y-2 p-2">
        <div className="flex items-center  justify-center gap-2 rounded-lg px-3 py-2 shadow-md shadow-slate-950">
          <Image src={"/chubbi.png"} height={20} width={20} alt="Falcon Logo" />
          <div className="flex flex-row items-center gap-2">
            <div className="text-xs">FalconAI</div>
            {orgBrandName && <XMarkIcon className="h-4 w-4 text-secondary" />}
            {orgBrandName && <div className="text-xs">{orgBrandName}</div>}
          </div>
        </div>
        <NewClass />
      </div>
      <SidebarChips className="col-span-4 row-start-2 row-end-12" />
      <div className="col-span-4 row-start-13">
        <ProfileDropdown profileLink={teacherProfileURL} />
      </div>
    </nav>
  );
}
