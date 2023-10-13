"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Avvvatars from "avvvatars-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type action = {
  name: string;
  icon: React.ReactNode;
  action: any;
  actionParams: any[];
};

type ItemCardProps = {
  avatarUrl?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: action[];
};

function ItemCard({
  avatarUrl,
  title,
  description,
  children,
  className,
  actions,
}: ItemCardProps) {
  return (
    <Card
      className={cn(
        "max-w-3xl bg-base-200 flex items-center space-x-4 w-full px-6 rounded-md hover:bg-base-100 border-none shadow-md shadow-base-200 hover:shadow-base-100 relative",
        className
      )}
    >
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-base-300">
          <Avvvatars value={title} style="shape" />
        </AvatarFallback>
      </Avatar>

      <Card className="flex-grow border-none bg-inherit shadow-none">
        <CardHeader>
          <h1 className="font-medium text-lg">{title}</h1>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      <div className="absolute flex top-2 right-5">
        <TooltipProvider>
          {actions?.map((action) => (
            <Tooltip key={action.name}>
              <TooltipTrigger>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="hover:bg-slate-600"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    action.action(...action.actionParams);
                  }}
                >
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-600 text-black">
                {action.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </Card>
  );
}

type ItemCardChipProps = {
  label: string;
  value: string | React.ReactNode;
  valueColor?: string;
  className?: string;
};

const ItemCardChip: React.FC<ItemCardChipProps> = ({
  label,
  value,
  valueColor,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-md px-4 py-2 flex items-center text-sm  ring-1 ring-slate-600",
        className
      )}
    >
      <span className="text-base-content font-semibold">{label}:</span>
      <span className={`${valueColor || "text-base-content"} ml-2`}>
        {value}
      </span>
    </div>
  );
};

export { ItemCard, ItemCardChip };
