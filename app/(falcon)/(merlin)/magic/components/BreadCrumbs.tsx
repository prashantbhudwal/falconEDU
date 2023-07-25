"use client";
import usePreferences from "@/hooks/usePreferences";

export default function BreadCrumbs() {
  const { topic, subtopic, grade, board, subject } = usePreferences();

  return (
    <div className="text-sm breadcrumbs max-w-2xl">
      <ul>
        <li className="">{board} </li>
        <li className="">{grade} </li>
        <li className="">{subject}</li>
        <li className="">{topic}</li>
        {/* For some reason both truncate are needed for desired behavior */}
        <li className="truncate">
          <p className="truncate">{subtopic}</p>
        </li>
      </ul>
    </div>
  );
}
