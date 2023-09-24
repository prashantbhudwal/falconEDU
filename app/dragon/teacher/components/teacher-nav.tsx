"use client";
import clsx from "clsx";
import Link from "next/link";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useTeacherLayoutSegments } from "../hooks/use-layout-segment-ids";

const teacherNavConfig = [
  {
    name: "Bots",
    path: "/bots",
    icon: "dashboard",
  },
  {
    name: "Students",
    path: "/students",
    icon: "user",
  },
  {
    name: "Tests",
    path: "/tests",
    icon: "book",
  },
];

export function TeacherNav({ classId }: { classId: string }) {
  return (
    <nav className="bg-base-200 w-full flex flex-col custom-scrollbar overflow-y-auto h-full">
      {teacherNavConfig.map((item) => (
        <TeacherNavItem key={item.path} item={item} close={() => {}} />
      ))}
    </nav>
  );
}

type TeacherNavItemProps = {
  item: (typeof teacherNavConfig)[number];
  close: () => void;
};

function TeacherNavItem({ item, close }: TeacherNavItemProps) {
  const { currentSegment, classId, botId, testId } = useTeacherLayoutSegments();
  console.log({ currentSegment, classId, botId, testId });

  const isActive = false;
  return (
    <Link
      href={item.path}
      className={clsx(
        "block rounded-md px-3 py-2 text-sm font-medium hover:text-neutral",
        {
          "text-gray-400 hover:bg-gray-800": !isActive,
          "text-white": isActive,
        }
      )}
    >
      {item.name}
    </Link>
  );
}
