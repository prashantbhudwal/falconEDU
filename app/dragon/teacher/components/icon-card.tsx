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
        "h-[140px] flex w-[160px] shadow-md  justify-center rounded-md border-1 border-transparent  cursor-pointer shadow-black",
        className
      )}
      {...props}
    >
      <div className="flex flex-col justify-end gap-8">
        <div className="self-center">{icon}</div>
        <div className="self-center font-light text-[18px] space-x-2">
          {text}
        </div>
      </div>
    </Card>
  );
}
