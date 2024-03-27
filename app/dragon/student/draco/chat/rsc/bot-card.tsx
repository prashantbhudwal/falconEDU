import { cn } from "@/lib/utils";
import { PieChartIcon } from "@radix-ui/react-icons";

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible",
        )}
      >
        <PieChartIcon />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}
