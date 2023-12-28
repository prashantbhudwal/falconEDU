"use client";
import { useAtom } from "jotai";
import { contentStreamCompletedAtom } from "@/lib/atoms/lesson";

type SidebarButtonProps = {
  onClick: () => void;
  className?: string;
  isActive: boolean;
  children: React.ReactNode;
};

export default function SidebarButton({
  onClick,
  className,
  isActive,
  children,
}: SidebarButtonProps) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);

  return (
    <button
      onClick={contentStreamCompleted ? onClick : () => {}}
      className={`test-sm rounded-md px-3 py-2 text-left capitalize text-text-300 ${
        contentStreamCompleted
          ? "opacity-100 hover:cursor-pointer hover:bg-slate-800"
          : "cursor-not-allowed opacity-50"
      }
      ${isActive ? "bg-slate-700" : ""}
      ${className}`}
    >
      {children}
    </button>
  );
}
