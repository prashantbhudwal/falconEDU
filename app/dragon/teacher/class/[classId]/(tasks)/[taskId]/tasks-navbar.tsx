import { db } from "../../../../routers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTaskIcon } from "../../utils";
import { BotConfig } from "@prisma/client";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { getClassURL } from "@/lib/urls";

export async function TasksNavbar({
  classId,
  userId,
  nameOfClass,
  task,
}: {
  classId: string;
  userId: string;
  nameOfClass: string;
  task: BotConfig;
}) {
  const name = task.name;
  const type = task.type;
  const { Icon, iconColor } = getTaskIcon(type);
  return (
    <div className="navbar flex w-full bg-base-300 border-b border-base-200">
      <div className="navbar-start gap-4 pr-2 flex">
        <Link href={getClassURL(classId)}>
          <Button
            className="flex items-center gap-1 hover:bg-base-300 hover:text-slate-100 hover:font-semibold"
            variant="ghost"
            size="sm"
          >
            <ChevronLeftIcon className="w-6" />
            <div>{nameOfClass}</div>
          </Button>
        </Link>
      </div>
      <div className="navbar-center">
        <div className={cn("flex items-center gap-1", iconColor)}>
          <Icon className="w-5" />
          <div>{name}</div>
        </div>
      </div>
      <div className="navbar-end pr-1 flex gap-2"></div>
    </div>
  );
}
