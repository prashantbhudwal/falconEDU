"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ClassNavProps extends React.HTMLAttributes<HTMLDivElement> {
  classId: string;
}

export function ClassNav({ classId, className, ...props }: ClassNavProps) {
  const rootPath = `/dragon/classes/class/${classId}`;
  const pages = [
    {
      name: "Bots",
      href: `${rootPath}/bots`,
    },
    {
      name: "Students",
      href: `${rootPath}/students`,
    },
    {
      name: "Resources",
      href: `${rootPath}/resources`,
    },
  ];
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("mb-4 flex items-center", className)} {...props}>
          {pages.map((page) => (
            <Link
              href={page.href}
              key={page.href}
              className={cn(
                "flex items-center px-4",
                pathname?.startsWith(page.href)
                  ? "font-bold text-primary"
                  : "font-medium text-muted-foreground"
              )}
            >
              {page.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
