"use client";
import { usePathname } from "next/navigation";

const getTitle = (pathname: string) => {
  switch (pathname) {
    case "/preferences":
      return (
        <>
          What are you{" "}
          <span className=" underline underline-offset-8 decoration-emerald-500">
            teaching
          </span>{" "}
          today?
        </>
      );
    case "/preferences/topic":
      return (
        <>
          What{" "}
          <span className=" underline underline-offset-8 decoration-emerald-500">
            chapter
          </span>{" "}
          are you focusing on?
        </>
      );
    case "/preferences/subtopic":
      return (
        <>
          What{" "}
          <span className=" underline underline-offset-8 decoration-emerald-500">
            topic
          </span>{" "}
          are you focusing on?
        </>
      );
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
    <div className="flex flex-col gap-10 items-center mt-7">
      <div className="text-4xl text-slate-300">{getTitle(pathname)}</div>
      {children}
    </div>
  );
}
