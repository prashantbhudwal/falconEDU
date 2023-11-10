"use client";
import { getBotsURL, getTestsUrl, getStudentsURL } from "@/lib/urls";
import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { DeleteDialog } from "./delete-dialog";
import { deleteClassByClassId } from "../mutations";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TeacherNav({
  classId,
  nameOfClass,
}: {
  classId: string;
  nameOfClass: string;
}) {
  const teacherNavConfig = [
    {
      name: "Bots",
      layoutSegment: "bots",
      href: getBotsURL(classId),
    },
    {
      name: "Tests",
      layoutSegment: "tests",
      href: getTestsUrl(classId),
    },
    {
      name: "Students",
      layoutSegment: "students",
      href: getStudentsURL(classId),
    },
  ];

  return (
    <nav className=" bg-base-200 w-full flex flex-col custom-scrollbar overflow-y-auto h-full py-4 space-y-1 pl-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-lg font-semibold text-neutral mb-4 truncate w-56 text-left">
              <div className="truncate">{nameOfClass}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-base-200 text-inherit text-center absolute top-[2rem] rounded-md shadow-md p-2 text-base">
            <p className="whitespace-nowrap">{nameOfClass}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {teacherNavConfig.map((item) => (
        <TeacherNavItem key={item.layoutSegment} item={item} />
      ))}
      <div className="flex justify-end min-w-[260px] fixed bottom-2">
        <DeleteDialog
          title="Delete Class"
          description="Are you sure you want to delete this class? This action can't be reversed."
          action={() => deleteClassByClassId(classId)}
          trigger={
            <Button
              variant={"outline"}
              size={"icon"}
              className="hover:bg-destructive"
            >
              <FiTrash />
            </Button>
          }
        />
      </div>
    </nav>
  );
}

type TeacherNavItemProps = {
  item: {
    name: string;
    layoutSegment: string;
    href: string;
  };
};

function TeacherNavItem({ item }: TeacherNavItemProps) {
  const currentSegment = useSelectedLayoutSegment();
  const isActive = currentSegment === item.layoutSegment;
  return (
    <Link
      href={item.href}
      className={clsx(
        "block rounded-md px-3 py-2 text-sm font-medium hover:text-neutral",
        {
          "text-gray-400 hover:bg-gray-800": !isActive,
          "text-white bg-base-100": isActive,
        }
      )}
    >
      {item.name}
    </Link>
  );
}
