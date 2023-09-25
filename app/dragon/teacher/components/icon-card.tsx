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
        "h-[140px] flex w-[160px] shadow-sm shadow-slate-800 justify-center border-none cursor-pointer bg-slate-950 ",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 h-full ">
        <div className="self-center flex-[1.3_1_0]  mt-[60px] text-2xl">
          {icon}
        </div>
        <div className="self -center truncate flex-[1_1_0] ">{text}</div>
      </div>
    </Card>
  );
}
