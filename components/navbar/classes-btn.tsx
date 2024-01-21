"use client";
import { db } from "@/app/dragon/teacher/routers";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { useSelectedLayoutSegment } from "next/navigation";
import usePageTracking from "@/hooks/usePageTracking";
import { useOrgMode } from "@/hooks/use-org-mode";

export function MyClassesBtn() {
  const { orgMode } = useOrgMode();
  const segment = useSelectedLayoutSegment();
  if (
    orgMode &&
    (segment == "(merlin)" || segment == "preferences" || segment == "raptor")
  )
    return (
      <Link href="/dragon/teacher/">
        <Button variant="outline" size={"default"}>
          <div className="flex items-center justify-center gap-2">
            <HomeIconSolid className="h-5 w-5" />
            <div>My Classes</div>
          </div>
        </Button>
      </Link>
    );
}
