"use client";
import { getBotsURL, getResourcesURL, getStudentsURL } from "@/lib/urls";
import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { DeleteDialog } from "./delete-dialog";
import { deleteClassByClassId } from "../mutations";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";

export function TeacherNav({ classId }: { classId: string }) {
  const teacherNavConfig = [
    {
      name: "Bots",
      layoutSegment: "bots",
      href: getBotsURL(classId),
    },
    {
      name: "Students",
      layoutSegment: "students",
      href: getStudentsURL(classId),
    },
    {
      name: "Tests",
      layoutSegment: "tests",
      href: getResourcesURL(classId),
    },
  ];

  return (
    <nav className="relative bg-base-200 w-full flex flex-col custom-scrollbar overflow-y-auto h-full py-4 space-y-1 pl-2">
      {teacherNavConfig.map((item) => (
        <TeacherNavItem key={item.layoutSegment} item={item} />
      ))}
      <DeleteDialog
        title="Delete Class"
        description="Are you sure you want to delete this class? This action can't be reversed."
        action={() => deleteClassByClassId(classId)}
        trigger={
          <Button
            variant={"outline"}
            size={"icon"}
            className="hover:bg-destructive absolute bottom-2 right-0 mr-2 mt-2"
          >
            <FiTrash />
          </Button>
        }
      />
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
