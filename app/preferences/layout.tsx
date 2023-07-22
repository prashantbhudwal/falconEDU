"use client";
import { usePathname } from "next/navigation";
import DesktopOnly from "../components/DesktopOnly";
import useDesktop from "../hooks/useDesktop";
import { userFlowAtom } from "../atoms/app";
import { useAtom } from "jotai";
const getTitle = (pathname: string, userFlow: string) => {
  switch (pathname) {
    case "/preferences":
      return (
        <>
          What are you{" "}
          <span className=" underline underline-offset-8 decoration-primary">
            teaching
          </span>{" "}
          today?
        </>
      );
    case "/preferences/topic":
      return (
        <>
          Which{" "}
          <span
            className={` underline underline-offset-8 ${
              userFlow === "worksheet"
                ? "decoration-secondary"
                : "decoration-primary"
            } `}
          >
            chapter
          </span>{" "}
          are you focusing on?
        </>
      );
    case "/preferences/subtopic":
      return (
        <>
          Which{" "}
          <span className=" underline underline-offset-8 decoration-primary">
            topic
          </span>{" "}
          are you focusing on?
        </>
      );
    case "/preferences/multipleSubtopics":
      return (
        <>
          Which{" "}
          <span className=" underline underline-offset-8 decoration-secondary">
            topics
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
  const [userFlow] = useAtom(userFlowAtom);
  const pathname = usePathname();
  const isDesktop = useDesktop();
  if (!isDesktop) {
    return <DesktopOnly />;
  }

  return (
    <div className="flex flex-col gap-10 items-center mt-7 w-full">
      <div className="text-3xl text-slate-300">
        {pathname && getTitle(pathname, userFlow)}
      </div>
      {children}
    </div>
  );
}
