import { cn } from "@/lib/utils";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
export const ClassNavItem = function ({
  isArchived,
  name,
  icon,
  href,
  layoutSegment,
  isPublished,
}: {
  name: string;
  layoutSegment: string;
  href: string;
  icon?: React.ReactNode;
  isArchived?: boolean;
  isPublished?: boolean;
}) {
  const segments = useSelectedLayoutSegments();
  const currentSegment = segments[2];
  const segmentActive = currentSegment === layoutSegment;
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium hover:text-neutral",
        {
          "text-gray-400 hover:bg-gray-800": !segmentActive,
          "text-white bg-base-100": segmentActive,
          "text-gray-600": isArchived,
        }
      )}
    >
      <div className="flex items-center gap-2 max-w-[200px]">
        {isArchived ? (
          <ArchiveBoxXMarkIcon className="w-4" />
        ) : (
          <div
            className={cn({
              "text-primary": isPublished,
            })}
          >
            {icon}
          </div>
        )}
        {isArchived ? (
          <div className="truncate w-[200px] flex items-center gap-1 text-xs font-light">
            {name}
          </div>
        ) : (
          <div className="truncate w-[200px]">{name}</div>
        )}
      </div>
    </Link>
  );
};
