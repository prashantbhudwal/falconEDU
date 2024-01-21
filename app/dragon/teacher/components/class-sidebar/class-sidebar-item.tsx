"use client";
import { cn } from "@/lib/utils";
import {
  ArchiveBoxXMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import {
  archiveAllBotsOfBotConfig,
  unArchiveAllBotsOfBotConfig,
} from "../../routers/botRouter";
import Link from "next/link";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import {
  ArchiveBoxArrowDownIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDuplicateConfig } from "../../hooks/use-duplicate-config";
import { TaskType } from "@/types/dragon";

export const ClassSidebarItem = function ({
  isArchived,
  name,
  icon,
  href,
  configId,
  isPublished,
  classId,
  userId,
  type,
}: {
  name: string;
  configId: string;
  href: string;
  icon?: React.ReactNode;
  isArchived?: boolean;
  isPublished?: boolean;
  classId: string;
  userId: string;
  type: TaskType;
}) {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const { duplicateConfig } = useDuplicateConfig();

  const currentSegment = segments[2];
  const segmentActive = currentSegment === configId;
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          href={href}
          className={cn(
            "block rounded-md px-3 py-2 text-sm font-medium hover:text-neutral",
            {
              "text-gray-400 hover:bg-gray-800": !segmentActive,
              "bg-base-100 text-white": segmentActive,
              "text-gray-600": isArchived,
            },
          )}
        >
          <div className="flex max-w-[200px] items-center gap-2">
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
              <div className="flex w-[200px] items-center gap-1 truncate text-xs font-light">
                {name}
              </div>
            ) : (
              <div className="w-[200px] truncate">{name}</div>
            )}
          </div>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          className="text-sm"
          onSelect={() => {
            if (isArchived) {
              unArchiveAllBotsOfBotConfig(configId);
            } else {
              archiveAllBotsOfBotConfig(configId);
            }
          }}
        >
          {isArchived ? "Unarchive" : "Archive"}
          <ContextMenuShortcut>
            {isArchived ? (
              <ArrowUpOnSquareIcon className="w-4 text-primary " />
            ) : (
              <ArchiveBoxArrowDownIcon className="w-4 text-destructive" />
            )}
          </ContextMenuShortcut>
        </ContextMenuItem>
        {!isArchived && (
          <ContextMenuItem
            className="text-sm"
            onSelect={() =>
              duplicateConfig({
                classId,
                configId,
                userId,
                type,
              })
            }
          >
            Duplicate
            <ContextMenuShortcut>
              <DocumentDuplicateIcon className="w-4" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
