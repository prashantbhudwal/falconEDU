"use client";
import { FiFolder } from "react-icons/fi";
import { usePathname } from "next/navigation";
import usePageTracking from "@/hooks/usePageTracking";
const showConfig = [/^\/dragon\/.*$/];
export default function TeacherBreadcrumbs() {
  //TODO https://chat.openai.com/share/f7d25303-7f40-4884-9b39-05635d77200f

  const { currentPage } = usePageTracking();
  const pathname = usePathname();
  const parts = pathname.split("/");
  const classId = parts[5];
  const botId = parts[9];

  const className = "Class 1";
  const botName = "Bot 1";
  const classes = true;
  const bots = true;

  const crumbList = (
    <ul>
      {classes && (
        <li className="flex gap-2 truncate">
          <FiFolder />
          <p className="truncate">Classes</p>
        </li>
      )}
      {className && (
        <li className="flex gap-2 truncate">
          <FiFolder />
          <p className="truncate">{className}</p>
        </li>
      )}
      {bots && (
        <li className="flex gap-2 truncate">
          <FiFolder />
          <p className="truncate">Bots</p>
        </li>
      )}
      {botName && (
        <li className="flex gap-2 truncate">
          <FiFolder />
          <p className="truncate"> {botName}</p>
        </li>
      )}
    </ul>
  );
  if (showConfig.some((regex) => regex.test(currentPage))) {
    return <div className="breadcrumbs max-w-2xl">{crumbList}</div>;
  }
}
