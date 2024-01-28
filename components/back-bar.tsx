import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

interface BackBarProps {
  link: string;
  noText?: boolean;
  className?: string;
}

const BackBar: React.FC<BackBarProps> = ({ link, noText, className }) => (
  <div
    className={cn(
      "flex h-20 items-center justify-start bg-base-300",
      className,
    )}
  >
    <Link href={link}>
      <Button
        className="flex items-center gap-1 hover:bg-base-300 hover:font-semibold hover:text-slate-100"
        variant="ghost"
        size="sm"
      >
        <ChevronLeftIcon className="h-8 w-8" />
        {!noText && <div>Back</div>}
      </Button>
    </Link>
  </div>
);

export default BackBar;
