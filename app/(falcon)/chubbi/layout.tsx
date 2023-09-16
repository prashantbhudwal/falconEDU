import { TooltipProvider } from "@ui/tooltip";
import MerlinGrid from "../(merlin)/components/grid";
import Sidebar from "@/components/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { SidebarList } from "./components/sidebar-list";
import * as React from "react";
import Navbar from "../../../components/navbar/navbar";
import NewChatBtn from "./components/new-chat-btn";

export default async function ChubbiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <TooltipProvider>
      <div className="flex h-screen min-w-full flex-col">
        <div className="h-full overflow-y-auto">
          <MerlinGrid>
            {session?.user ? (
              <Sidebar className="col-span-2 col-start-1 row-start-1">
                <NewChatBtn />

                <React.Suspense
                  fallback={<div className="flex-1 overflow-auto" />}
                >
                  {/* @ts-ignore */}
                  <SidebarList userId={session?.user?.id} />
                </React.Suspense>
              </Sidebar>
            ) : (
              <></>
            )}
            <div className="col-span-8 col-start-3 bg-slate-950 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </MerlinGrid>
        </div>
      </div>
    </TooltipProvider>
  );
}
