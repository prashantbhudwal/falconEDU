"use client";
import SidebarButton from "@/app/(engines)/(merlin)/magic/components/sidebar-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ChubbiChat as Chat } from "@/types";
import { cn } from "../../../../lib/utils";
import { buttonVariants } from "@ui/button";
import { IconMessage } from "@ui/icons";
interface SidebarItemProps {
  chat: Chat;
  children: React.ReactNode;
}
export const chatStem = "/chubbi/chat";

export function SidebarItem({ chat, children }: SidebarItemProps) {
  const pathname = usePathname();
  const chatRoute = `${chatStem}/${chat.id}`;
  const isActive = pathname === chatRoute;

  if (!chat?.id) return null;

  return (
    <div className="relative w-full">
      <div className="absolute left-2 top-1 flex h-6 w-6 items-center justify-center">
        <IconMessage className="mr-2" />
      </div>
      <Link
        href={chatRoute}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group w-full pl-8 pr-16",
          isActive && "bg-slate-600",
        )}
      >
        <div
          className="relative max-h-5 w-16 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">{chat.title}</span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </div>
  );
}
