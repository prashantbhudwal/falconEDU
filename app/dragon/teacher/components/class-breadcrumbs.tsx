"use client";
import { FiFolder } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function ClassBreadcrumbs() {
  const pathname = usePathname();
  console.log(pathname);
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
        <li className="truncate flex gap-2">
          <FiFolder />
          <p className="truncate">Classes</p>
        </li>
      )}
      {className && (
        <li className="truncate flex gap-2">
          <FiFolder />
          <p className="truncate">{className}</p>
        </li>
      )}
      {bots && (
        <li className="truncate flex gap-2">
          <FiFolder />
          <p className="truncate">Bots</p>
        </li>
      )}
      {botName && (
        <li className="truncate flex gap-2">
          <FiFolder />
          <p className="truncate"> {botName}</p>
        </li>
      )}
    </ul>
  );

  return <div className="breadcrumbs max-w-2xl text-xs">{crumbList}</div>;
}
