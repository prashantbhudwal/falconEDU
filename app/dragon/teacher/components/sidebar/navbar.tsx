import { MyClassesBtn } from "@/components/navbar/classes-btn";
import DragonHomeBtn from "@/components/navbar/dragon-home-btn";
import ProfileDropDown from "@/components/navbar/profile-dropdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiSliders, FiAirplay, FiTool } from "react-icons/fi";
import { NewClass } from "../new-class";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  teacherTrainingURL,
  teacherAvatarURL,
  teacherProfileURL,
  teacherAIToolsURL,
} from "@/lib/urls";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "../../../../../lib/routers";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const { orgBrandName } = await db.org.getTeacherBrandNameByUserId({ userId });

  return (
    <div className="flex flex-row justify-between bg-base-200 px-1 py-3 shadow-sm shadow-base-100">
      <div className="flex flex-row items-center space-x-5 pr-2">
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
      <div className="flex flex-row items-center gap-3 pr-1">
        <Link href={teacherAvatarURL}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="flex items-center gap-2 rounded-xl"
          >
            <FiSliders className="text-primary" />
            <span> Avatar </span>
          </Button>
        </Link>
        <Link href={teacherTrainingURL}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="flex items-center gap-2 rounded-xl"
          >
            <FiAirplay className="text-secondary" />
            <span> Teacher Training </span>
          </Button>
        </Link>
        <Link href={teacherAIToolsURL}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="flex items-center gap-2 rounded-xl"
          >
            <FiTool className="text-info" />
            <span> Tools </span>
          </Button>
        </Link>
        <ProfileDropDown url={teacherProfileURL} />
      </div>
    </div>
  );
}
