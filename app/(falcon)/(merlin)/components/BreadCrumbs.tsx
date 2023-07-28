"use client";
import usePreferences from "@/hooks/usePreferences";

export default function BreadCrumbs() {
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

  const fullCrumbs = <div className="text-xs breadcrumbs">{crumbList}</div>;

  return (
    <div className="relative group">
      <div className="text-xs breadcrumbs max-w-2xl">{crumbList}</div>
      <div className="absolute left-0 z-10 bg-base-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded shadow-lg mt-2">
        {fullCrumbs}
      </div>
    </div>
  );
}
