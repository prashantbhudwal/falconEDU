"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { HomeIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import usePageTracking from "@/hooks/usePageTracking";
import { useSelectedLayoutSegment } from "next/navigation";
import { useOrgMode } from "@/hooks/use-org-mode";
export default function DragonHomeBtn() {
  const segment = useSelectedLayoutSegment();
  const { currentPage } = usePageTracking();
  const { orgMode } = useOrgMode();

  if (
    segment == "class" ||
    currentPage == "/dragon/teacher" ||
    currentPage == "/dragon/teacher/teacher-preferences" ||
    (currentPage == "/profile/teacher" && orgMode)
  )
    return (
      <Link href="/dragon/teacher">
        <Button variant={"ghost"} size={"icon"}>
          {currentPage == "/dragon/teacher" ? (
            <HomeIconSolid className="w-5 h-5" />
          ) : (
            <HomeIcon className="w-5 h-5" />
          )}
        </Button>
      </Link>
    );
  return null;
}
