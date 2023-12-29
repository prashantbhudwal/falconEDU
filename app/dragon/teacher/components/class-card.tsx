import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ClassCardProps = {
  icon: React.ReactNode;
  name: string;
  className?: string;
};

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ClassCard({
  icon,
  name,
  className,
  ...props
}: ClassCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "py-2 px-4 h-24 w-64 shadow-md flex items-center space-x-2 rounded-2xl border-transparent cursor-pointer bg-base-200 hover:bg-base-100 transition-colors duration-200 ease-in-out",
              className
            )}
            {...props}
          >
            <div className="bg-base-300 p-3 rounded-full">{icon}</div>
            <div className="flex font-medium tracking-wide capitalize truncate w-5/6 px-2 text-center">
              <div className="truncate text-sm">{name}</div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="bg-base-300 text-inherit text-center absolute top-[5.6rem] rounded-md shadow-md p-2">
          <p className="whitespace-nowrap">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
