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
  const tooltipWidth = `${name.length * 0.5}rem`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "h-[180px] w-[180px] shadow-md flex flex-col items-center justify-between rounded-md border-transparent cursor-pointer",
              className
            )}
            {...props}
          >
            <div className="flex-1 flex items-center justify-center">
              {icon}
            </div>
            <CardFooter className="flex place-content-center font-medium tracking-wide capitalize truncate w-5/6 px-2 text-center">
              <div className="truncate">{name}</div>
            </CardFooter>
          </Card>
        </TooltipTrigger>
        <TooltipContent
          className="bg-base-300 text-inherit absolute top-40 min-w-[100px] text-center rounded-md shadow-md p-2"
          style={{ width: tooltipWidth }}
        >
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
