"use client";
import BackBar from "@/components/back-bar";
import { backBarAtom } from "@/lib/atoms/app";
import { useAtomValue } from "jotai";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { url, title } = useAtomValue(backBarAtom);

  return (
    <div className="flex h-screen w-full flex-col bg-base-300">
      <BackBar link={url} title={title} />
      <div className="custom-scrollbar h-full w-full overflow-y-auto bg-base-300 p-2">
        {children}
      </div>
    </div>
  );
}
