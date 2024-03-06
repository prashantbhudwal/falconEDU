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
  BellRingingIcon,
} from "@/components/icons";
import { url } from "@/lib/urls";
import { db } from "@/lib/routers";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const sidebarChips = [
  {
    link: url.teacher.home,
    icon: <HomeIcon className="text-white" size="xxs" />,
    label: "Classes",
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
    label: "Training",
    segment: "teacher-training",
  },
  //   {
  //     link: url.teacher.settings.tools,
  //     icon: <ToolIcon className="text-info" size="xxs" />,
  //     label: "Tools",
  //     segment: "tools",
  //   },
];

export function SidebarChips({
  className,
  userId,
}: {
  className?: string;
  userId: string;
}) {
  const segments = useSelectedLayoutSegments();
  const segmentsSet = new Set(segments);
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <NotificationChip
        link={url.teacher.settings.notifications}
        label="Notifications"
        recipientId={userId}
        isSelected={segmentsSet.has("notifications")}
      />
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
          "bg-base-300 text-white disabled:opacity-100": isSelected,
        })}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const NotificationChip = ({
  link,
  label,
  isSelected,
  recipientId,
}: {
  link: string;
  label: string;
  isSelected?: boolean;
  recipientId: string;
}) => {
  const data = useQuery({
    queryKey: ["notifications"],
    queryFn: () => db.notification.hasUnread({ recipientId }),
    refetchInterval: 1000 * 60 * 1,
  });
  const hasUnread = data.data?.hasUnread;
  const unReadCount = data.data?.unreadNotificationsCount;

  return (
    <Link href={link}>
      <Button
        variant={"ghost"}
        size={"default"}
        disabled={isSelected}
        className={cn("flex w-full items-center justify-start gap-2", {
          "bg-base-300 text-white disabled:opacity-100": isSelected,
        })}
      >
        {!hasUnread ? (
          <BellIcon className="text-primary" size="xxs" />
        ) : (
          <BellRingingIcon className="text-secondary" size="xxs" />
        )}
        <span>{label}</span>
        {hasUnread && (
          <Badge className="ml-auto rounded-full" variant={"secondary"}>
            {unReadCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
};
