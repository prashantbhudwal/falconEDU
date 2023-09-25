import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type IconCardProps = {
  icon: React.ReactNode;
  text: string;
  className?: string;
};

export default function IconCard({
  icon,
  text,
  className,
  ...props
}: IconCardProps) {
  return (
    <Card
      className={cn(
        "h-32 flex items-center w-32 justify-center shadow-slate-400 border-none",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        <div className="mx-auto">{icon}</div>
        <div className="truncate">{text}</div>
      </div>
    </Card>
  );
}
