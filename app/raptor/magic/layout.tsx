"use client";
import Section from "@/app/components/Section";
import Sidebar from "../../components/Sidebar";
export default function AidLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <Sidebar className="col-start-1 col-span-2 row-start-1">
        <Section title="Teaching Aids">Teaching Aids</Section>
      </Sidebar>
      <div className="col-start-3 col-span-8 min-h-screen">{children}</div>
    </div>
  );
}
