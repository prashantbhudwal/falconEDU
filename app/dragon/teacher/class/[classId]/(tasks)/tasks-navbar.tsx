import { db } from "../../../routers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function TasksNavbar({
  classId,
  userId,
  nameOfClass,
}: {
  classId: string;
  userId: string;
  nameOfClass: string;
}) {
  return (
    <div className="navbar flex w-full bg-base-300 border-b border-base-200">
      <div className="navbar-start gap-4 pr-2 pl-6 flex"></div>
      <div className="navbar-center">{nameOfClass}</div>
      <div className="navbar-end pr-1 flex gap-2"></div>
    </div>
  );
}
 