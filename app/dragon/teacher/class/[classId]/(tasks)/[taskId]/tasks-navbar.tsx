import { db } from "../../../../routers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function TasksNavbar({
  classId,
  userId,
  taskId,
  nameOfClass,
  nameOfTask,
}: {
  classId: string;
  userId: string;
  taskId: string;
  nameOfClass: string;
  nameOfTask: string;
}) {
  return (
    <div className="navbar flex w-full bg-base-300 border-b border-base-200">
      <div className="navbar-start gap-4 pr-2 pl-6 flex"></div>
      <div className="navbar-center">
        <div className="flex gap-2">
          <div>{nameOfClass}</div>
          <div>/</div>
          <div>{nameOfTask}</div>
        </div>
      </div>
      <div className="navbar-end pr-1 flex gap-2"></div>
    </div>
  );
}
