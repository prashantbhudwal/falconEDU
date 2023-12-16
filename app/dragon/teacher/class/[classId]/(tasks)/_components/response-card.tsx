"use client";
import { StudentsByBotConfigId } from "../[taskId]/test/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Avvvatars from "avvvatars-react";
import { ClassDialog } from "../../../../components/class-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { TaskType } from "@/types/dragon";
type action = {
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: any;
  actionParams: any[];
};

type ResponseCardProps = {
  children: React.ReactNode;
  className?: string;
  actions?: action[];
  link: string;
  student: StudentsByBotConfigId["students"][0];
  type: TaskType;
};

function ResponseCard({
  children,
  className,
  actions,
  link,
  student,
  type,
}: ResponseCardProps) {
  const email = student.email;
  const title = student.name;
  const description = student.email;
  const avatarUrl = student.image;
  const isSubmitted = student.isSubmitted;
  const disabled = !isSubmitted && type == "test";
  return (
    <Link
      href={disabled ? "" : link}
      className={cn(
        "bg-base-200 max-w-3xl flex items-start py-6 space-x-6 w-full px-6 rounded-md hover:bg-base-100 relative my-1 border border-base-200",
        {
          "cursor-not-allowed hover:bg-base-200": disabled,
        },
        className
      )}
    >
      <div className="py-1">
        <Avatar className={cn("h-12 w-12 ring ring-base-300/80", {})}>
          <AvatarImage src={avatarUrl ?? ""} />
          <AvatarFallback className="bg-base-300">
            <Avvvatars value={title ?? ""} style="shape" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-grow border-none bg-inherit shadow-none flex flex-col space-y-3">
        <div className="flex flex-col space-y-1">
          <h1 className="font-bold ">{title}</h1>
          {description && (
            <div className="text-slate-600 text-sm">{description}</div>
          )}
        </div>
        <div>{children}</div>
      </div>
      <div className="absolute flex top-2 right-5">
        <TooltipProvider>
          {actions?.map((action) => (
            <Tooltip key={action.name}>
              <TooltipTrigger>
                <ClassDialog
                  title={action.title}
                  description={action.description}
                  action={() => action.action(...action.actionParams)}
                  trigger={
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="hover:bg-slate-600"
                    >
                      {action.icon}
                    </Button>
                  }
                />
              </TooltipTrigger>
              <TooltipContent className="bg-slate-600 text-black">
                {action.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </Link>
  );
}

type CardChipProps = {
  label?: string;
  value: string | React.ReactNode;
  valueColor?: string;
  className?: string;
};

const CardChip: React.FC<CardChipProps> = ({
  label,
  value,
  valueColor,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-md px-4 pl-0 flex items-center justify-start text-sm ",
        className
      )}
    >
      {label && (
        <span className="text-base-content font-semibold">{label}:</span>
      )}
      <span className={`${valueColor || "text-base-content"}`}>{value}</span>
    </div>
  );
};

export { ResponseCard, CardChip };
