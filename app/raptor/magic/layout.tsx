"use client";
import { worksheetAidType } from "@/types";
const worksheetAids: worksheetAidType[] = ["worksheet", "answerKey"];
import Section from "@/app/components/Section";
import Sidebar from "@/app/components/Sidebar";
import SidebarButton from "@/app/magic/components/SidebarButton";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getEmoji, getName } from "@/app/utils";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
export default function AidLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full">
        <Sidebar className="col-start-1 col-span-2 row-start-1">
          <Section title="Teaching Aids" color="secondary">
            <SidebarButton
              onClick={() => router.push(`raptor/magic/worksheet`)}
              isActive={pathname === `raptor/magic/worksheet`}
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
                )
            )}
          </Section>
        </Sidebar>
        <div className="col-start-3 col-span-8 min-h-screen">{children}</div>
      </div>
    </DndProvider>
  );
}
