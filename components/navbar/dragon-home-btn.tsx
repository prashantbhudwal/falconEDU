"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { HomeIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import usePageTracking from "@/hooks/usePageTracking";
import { useSelectedLayoutSegment } from "next/navigation";
import { useOrgMode } from "@/hooks/use-org-mode";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@ui/tooltip";

export default function DragonHomeBtn({ className }: { className?: string }) {
  const { currentPage } = usePageTracking();
  const { orgMode } = useOrgMode();

  if (
    currentPage == "/dragon/teacher" ||
    (currentPage == "/profile/teacher" && orgMode) ||
    currentPage.startsWith("/dragon/teacher")
  )
    return (
      <TooltipProvider>
        <Tooltip delayDuration={20}>
          <TooltipTrigger asChild>
            <Link href="/dragon/teacher" className={cn("", className)}>
              <Button variant={"ghost"} size={"icon"}>
                {currentPage == "/dragon/teacher" ? (
                  <HomeIconSolid className="w-5 h-5" />
                ) : (
                  <HomeIcon className="w-4 h-4" />
                )}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-base-200 text-slate-300">
            All Classes
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  return null;
}
