import { NewClass } from "../new-class";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { teacherProfileURL } from "@/lib/urls";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { db } from "@/lib/routers";
import { ProfileDropdown } from "./profile-dropdown";
import { SidebarChips } from "./sidebar-chips";
import { cn } from "@/lib/utils";

export async function Sidebar() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const { orgBrandName } = await db.org.getTeacherBrandNameByUserId({ userId });
  const isOrgBrandNameShort = orgBrandName && orgBrandName.length < 30;
  const showFlaconAIText = !orgBrandName || isOrgBrandNameShort;
  const showCrossIcon = isOrgBrandNameShort;

  return (
    <nav className="col-span-4 col-start-1 flex h-screen  w-full flex-col space-y-2 bg-base-200/50">
      <div className="flex flex-col space-y-2  p-2">
        <div className="flex items-center  justify-center gap-2 rounded-lg px-3 py-2 shadow-md shadow-slate-950">
          <Image src={"/chubbi.png"} height={20} width={20} alt="Falcon Logo" />
          <div className={cn("flex w-full flex-row items-center gap-2 px-1")}>
            {showFlaconAIText ? <div className="text-xs">FalconAI</div> : null}
            {showCrossIcon ? (
              <XMarkIcon className="h-4 w-4 text-secondary" />
            ) : null}
            {orgBrandName && (
              <div className="truncate text-xs">{orgBrandName}</div>
            )}
          </div>
        </div>
        <NewClass className="rounded-none border-b border-dashed hover:border-none hover:bg-primary/90 hover:text-black active:translate-y-1" />
      </div>
      <SidebarChips className="flex-grow " userId={userId} />
      <div className="">
        <ProfileDropdown profileLink={teacherProfileURL} />
      </div>
    </nav>
  );
}
