"use client";
import Link from "next/link";
import {
  ToolIcon,
  FalconIcon,
  PieChartIcon,
  AIMagicIcon,
} from "@/components/icons";
import { url } from "@/lib/urls";

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 z-50 w-full bg-base-300 shadow-md">
      <div className="flex justify-around py-2">
        <NavbarItem href={url.orgAdmin.home} Icon={AIMagicIcon} text="Act" />
        <NavbarItem
          href={url.orgAdmin.explore.home}
          Icon={PieChartIcon}
          text="Explore"
        />
        <NavbarItem
          href={url.orgAdmin.manage.home}
          Icon={ToolIcon}
          text="Manage"
        />
      </div>
    </div>
  );
};

const NavbarItem = ({
  href,
  Icon,
  text,
}: {
  href: string;
  Icon: FalconIcon;
  text: string;
}) => {
  return (
    <Link href={href} className="flex flex-col items-center">
      <Icon size="sm" />
      <span className="text-sm">{text}</span>
    </Link>
  );
};
