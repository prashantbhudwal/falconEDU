import * as React from "react";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { clearChats } from "../actions";
import { Sidebar } from "../components/sidebar";
import { SidebarList } from "../components/sidebar-list";
import {
  IconNextChat,
} from "../components/ui/icons";
import { SidebarFooter } from "../components/sidebar-footer";
import { ClearHistory } from "../components/clear-history";

export async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.email} />
            </React.Suspense>
            <SidebarFooter>
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
            <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" />
          </Link>
        )}
      </div>
    </header>
  );
}
