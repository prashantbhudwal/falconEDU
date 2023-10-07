import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type IconCardProps = {
  icon?: React.ReactNode;
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
      className={cn("px-6 h-20 flex items-center w-48", className)}
      {...props}
    >
      <div className="flex items-baseline space-x-3 truncate">
        <div>{icon}</div>
        <div className="truncate">{text}</div>
      </div>
    </Card>
  );
}
