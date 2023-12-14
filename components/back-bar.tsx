import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

interface BackBarProps {
  link: string;
  noText?: boolean;
}

const BackBar: React.FC<BackBarProps> = ({ link, noText }) => (
  <div className="h-20 flex items-center justify-start bg-base-300">
    <Link href={link}>
      <Button
        className="flex items-center gap-1 hover:bg-base-300 hover:text-slate-100 hover:font-semibold"
        variant="ghost"
        size="sm"
      >
        <ChevronLeftIcon className="w-8 h-8" />
        {!noText && <div>Back</div>}
      </Button>
    </Link>
  </div>
);

export default BackBar;
