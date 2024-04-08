import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { LeftArrowIcon } from "../icons";

interface BackBarProps {
  link: string;
  noText?: boolean;
  className?: string;
  title?: string;
}

const BackBar: React.FC<BackBarProps> = ({
  link,
  noText,
  className,
  title,
}) => {
  const header = title ? title : noText ? "" : "Back";

  return (
    <div
      className={cn(
        "flex h-20 items-center justify-start bg-base-300",
        className,
      )}
    >
      <Link href={link}>
        <Button
          className="flex items-center gap-5 hover:bg-base-300 hover:font-semibold hover:text-slate-100"
          variant="ghost"
          size="sm"
        >
          <LeftArrowIcon size="sm" />
          <div className="text-base font-medium capitalize text-slate-400">
            {header}
          </div>
        </Button>
      </Link>
    </div>
  );
};

export default BackBar;
