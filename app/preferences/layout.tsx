"use client";
import { usePathname } from "next/navigation";

const getTitle = (pathname: string) => {
  switch (pathname) {
    case "/preferences":
      return "What are you teaching today?";
    case "/preferences/topic":
      return "What chapter are you teaching?";
    case "/preferences/subtopic":
      return "What topic are you teaching?";
    default:
      return "What are you teaching today?";
  }
};

export default function PreferencesLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 items-center mt-7">
      <div className="text-4xl text-slate-400">{getTitle(pathname)}</div>
      {children}
    </div>
  );
}
