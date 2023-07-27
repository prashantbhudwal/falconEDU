"use client";
import usePreferences from "@/hooks/usePreferences";

export default function BreadCrumbs() {
  const { topic, subtopic, grade, board, subject } = usePreferences();

  const fullCrumbs = (
    <div className="text-xs breadcrumbs">
      <ul>
        <li className="truncate">
          <p className="truncate">{board}</p>
        </li>
        <li className="truncate">
          <p className="truncate">G {grade}</p>
        </li>
        <li className="truncate">
          <p className="truncate">{subject}</p>
        </li>
        <li className="">
          <p className="truncate">{topic}</p>
        </li>
        <li>{subtopic}</li>
      </ul>
    </div>
  );

  return (
    <div className="relative group">
      <div className="text-xs breadcrumbs max-w-2xl">
        <ul>
          <li className="truncate">
            <p className="truncate">{board}</p>
          </li>
          <li className="truncate">
            <p className="truncate">Grade {grade}</p>
          </li>
          <li className="truncate">
            <p className="truncate">{subject}</p>
          </li>
          <li className="truncate">
            <p className="truncate">{topic}</p>
          </li>
          <li className="text-secondary">{subtopic}</li>
        </ul>
      </div>
      <div className="absolute left-0 z-10 bg-base-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded shadow-lg mt-2">
        {fullCrumbs}
      </div>
    </div>
  );
}
