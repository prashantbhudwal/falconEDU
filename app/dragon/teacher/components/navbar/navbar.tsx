import { MyClassesBtn } from "@/components/navbar/classes-btn";
import DragonHomeBtn from "@/components/navbar/dragon-home-btn";
import ProfileDropDown from "@/components/navbar/profile-dropdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiSliders, FiAirplay, FiTool } from "react-icons/fi";
import {
  teacherTrainingURL,
  teacherAvatarURL,
  teacherProfileURL,
  teacherAIToolsURL,
} from "@/lib/urls";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between bg-base-200 shadow-sm shadow-base-100 py-2 px-1">
      <div className="gap-4 pr-2">
        <div className="shadow-md shadow-slate-950  flex gap-2 items-center justify-center px-3 py-2 rounded-lg">
          <Image src={"/chubbi.png"} height={20} width={20} alt="Falcon Logo" />
          <div className="text-xs">FalconAI</div>
        </div>
      </div>
      <div className="flex flex-row gap-3 pr-1 items-center">
        <Link href={teacherAvatarURL}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="rounded-xl flex items-center gap-2"
          >
            <FiSliders className="text-primary" />
            <span> My Avatar </span>
          </Button>
        </Link>
        <Link href={teacherTrainingURL}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="rounded-xl flex items-center gap-2"
          >
            <FiAirplay className="text-secondary" />
            <span> Teacher Training </span>
          </Button>
        </Link>
        <Link href={teacherAIToolsURL}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="rounded-xl flex items-center gap-2"
          >
            <FiTool className="text-info" />
            <span> AI Tools </span>
          </Button>
        </Link>
        <ProfileDropDown url={teacherProfileURL} />
      </div>
    </div>
  );
}
