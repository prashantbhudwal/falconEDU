"use client";
import { useAtom } from "jotai";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";

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
      className={`capitalize text-slate-300 px-3 py-2 rounded-md text-left ${
        contentStreamCompleted
          ? "opacity-100 hover:bg-slate-800 hover:cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }
      ${isActive ? "bg-slate-700" : ""}
      ${className}`}
    >
      {children}
    </button>
  );
}
