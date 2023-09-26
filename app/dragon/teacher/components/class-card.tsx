import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ClassCardProps = {
  icon: React.ReactNode;
  text: string;
  className?: string;
};

export default function ClassCard({
  icon,
  text,
  className,
  ...props
}: ClassCardProps) {
  return (
    <Card
      className={cn(
        "h-[180px]  w-[180px] shadow-md flex flex-col rounded-md justify-end border-transparent border-none  cursor-pointer shadow-black",
        className
      )}
      {...props}
    >
      <CardContent className="self-center justify-self-end">{icon}</CardContent>
      <CardFooter className="self-center font-light text-[21px] tracking-wide capitalize">
        {text}
      </CardFooter>
    </Card>
  );
}
