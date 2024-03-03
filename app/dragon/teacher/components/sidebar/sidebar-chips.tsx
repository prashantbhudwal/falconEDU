"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import {
  HomeIcon,
  SlidersIcon,
  ScreenIcon,
  BellIcon,
} from "@/components/icons";
import { url } from "@/lib/urls";

const sidebarChips = [
  {
    link: url.teacher.settings.notifications,
    icon: <BellIcon className="text-primary" size="xxs" />,
    label: "Notifications",
    segment: "notifications",
  },
  {
    link: url.teacher.home,
    icon: <HomeIcon className="text-white" size="xxs" />,
    label: "All Classes",
    segment: "home",
  },
  {
    link: url.teacher.settings.avatar,
    icon: <SlidersIcon className="text-secondary" size="xxs" />,
    label: "Avatar",
    segment: "teacher-preferences",
  },
  {
    link: url.teacher.settings.training,
    icon: <ScreenIcon className="text-info" size="xxs" />,
    label: "Teacher Training",
    segment: "teacher-training",
  },
  //   {
  //     link: url.teacher.settings.tools,
  //     icon: <ToolIcon className="text-info" size="xxs" />,
  //     label: "Tools",
  //     segment: "tools",
  //   },
];

export function SidebarChips({ className }: { className?: string }) {
  const segments = useSelectedLayoutSegments();
  const segmentsSet = new Set(segments);
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {sidebarChips.map((chip) => {
        const isSelected =
          segmentsSet.size === 0 && chip.segment === "home"
            ? true
            : segmentsSet.has(chip.segment);
        return (
          <SidebarChip
            key={chip.link}
            link={chip.link}
            icon={chip.icon}
            label={chip.label}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
}

const SidebarChip = ({
  link,
  icon,
  label,
  isSelected,
}: {
  link: string;
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
}) => {
  return (
    <Link href={link}>
      <Button
        variant={"ghost"}
        size={"default"}
        disabled={isSelected}
        className={cn("flex w-full items-center justify-start gap-2", {
          "bg-base-300 text-white ": isSelected,
        })}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};
