"use client";
import usePreferences from "@/hooks/usePreferences";
import usePageTracking from "@/hooks/usePageTracking";
const hideConfig = ["/pricing", "/profile", "/dragon"];
export default function FalconBreadCrumbs() {
  const { currentPage } = usePageTracking();
  const { topic, subtopic, grade, board, subject } = usePreferences();
  const crumbList = (
    <ul>
      {board && (
        <li className="truncate">
          <p className="truncate">{board}</p>
        </li>
      )}
      {grade && (
        <li className="truncate">
          <p className="truncate">Grade {grade}</p>
        </li>
      )}
      {subject && (
        <li className="truncate">
          <p className="truncate">{subject}</p>
        </li>
      )}
      {topic && (
        <li className="truncate">
          <p className="truncate">{topic}</p>
        </li>
      )}
      {subtopic && <li className="text-secondary">{subtopic}</li>}
    </ul>
  );

  const fullCrumbs = <div className="breadcrumbs text-xs">{crumbList}</div>;

  if (hideConfig.includes(currentPage)) return null;

  return (
    <div className="group relative">
      <div className="breadcrumbs max-w-2xl text-xs">{crumbList}</div>
      <div className="absolute left-0 z-10 mt-2 rounded bg-base-100 p-2 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {fullCrumbs}
      </div>
    </div>
  );
}
