"use client";
import { url } from "@/lib/urls";
import BackBar from "@/components/back-bar";
import { useSelectedLayoutSegment } from "next/navigation";
type ManageSegment = "admins" | "org" | "teachers" | "students";

const segmentMap: Map<ManageSegment, string> = new Map([
  ["admins", "Admins"],
  ["org", "Organization"],
  ["teachers", "Teachers"],
  ["students", "Students"],
]);

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment() as ManageSegment;
  const displaySegment = segmentMap.get(segment) || "";

  return (
    <div className="flex h-screen w-full flex-col bg-base-300">
      <div className="flex h-full w-full flex-col">
        <BackBar
          link={url.orgAdmin.manage.home}
          title={`Manage ${displaySegment}`}
        />
        <div className="custom-scrollbar w-full overflow-y-auto bg-base-300">
          <div className="min-h-screen w-full bg-base-300 pb-10 shadow-sm shadow-base-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
