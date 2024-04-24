"use client";
import Link from "next/link";
import { ToolIcon, PieChartIcon, AIMagicIcon } from "@/components/icons";
import { url } from "@/lib/urls";
import { useSelectedLayoutSegment } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AdminHomeSegments = "explore" | "manage" | null;

const bottomNavConfig = [
  { href: url.orgAdmin.home, Icon: AIMagicIcon, text: "Act", segment: null },
  {
    href: url.orgAdmin.explore.home,
    Icon: PieChartIcon,
    text: "Explore",
    segment: "explore",
  },
  {
    href: url.orgAdmin.manage.home,
    Icon: ToolIcon,
    text: "Manage",
    segment: "manage",
  },
] as const;

export const BottomNav = () => {
  const layoutSegment = useSelectedLayoutSegment() as AdminHomeSegments;

  return (
    <div className="fixed bottom-0 z-40 w-full bg-base-300 shadow-md">
      <motion.div layout className="flex justify-around py-2">
        {bottomNavConfig.map(({ href, Icon, text, segment }) => {
          const isSelected = layoutSegment === segment;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-w-20 flex-col items-center px-4 py-1",
                {
                  "text-primary": isSelected,
                  "text-slate-600": !isSelected,
                },
              )}
            >
              <Icon size="xs" />
              <span className="text-xs">{text}</span>
              {isSelected && (
                <motion.div
                  layoutId="activeNavItem"
                  className="absolute inset-0 -z-10 rounded-full bg-purple-800"
                  transition={{ duration: 0.2 }}
                ></motion.div>
              )}
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};
