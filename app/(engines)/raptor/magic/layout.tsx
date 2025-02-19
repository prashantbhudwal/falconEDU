"use client";
import { worksheetAidType } from "@/types";
const worksheetAids: worksheetAidType[] = ["worksheet", "answerKey"];
import Section from "@/components/section";
import Sidebar from "@/components/sidebar";
import SidebarButton from "@/app/(engines)/(merlin)/magic/components/sidebar-button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getEmoji, getName } from "@/lib";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export default function AidLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid h-full w-full select-none grid-cols-12 gap-4 overflow-y-auto">
        <Sidebar className="col-span-2 col-start-1 row-start-1">
          <Section title="Teaching Aids" color="secondary">
            <SidebarButton
              onClick={() => router.push(`/raptor/magic/worksheet`)}
              isActive={pathname === `/raptor/magic/worksheet`}
            >
              {`${getEmoji("worksheet")} ${getName("worksheet")}`}
            </SidebarButton>
            {worksheetAids.map(
              (aid: worksheetAidType) =>
                aid != "worksheet" && (
                  <SidebarButton
                    onClick={() => router.push(`/raptor/magic/aid/${aid}`)}
                    isActive={pathname === `/raptor/magic/aid/${aid}`}
                    key={aid}
                  >
                    {`${getEmoji(aid)} ${getName(aid)}`}
                  </SidebarButton>
                ),
            )}
          </Section>
        </Sidebar>
        <div className="col-span-8 col-start-3 h-full">{children}</div>
      </div>
    </DndProvider>
  );
}
