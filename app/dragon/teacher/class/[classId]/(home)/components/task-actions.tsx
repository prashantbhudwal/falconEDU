"use client";
import { useDuplicateConfig } from "@/app/dragon/teacher/hooks/use-duplicate-config";
import { db } from "@/app/dragon/teacher/routers";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskType } from "@/types/dragon";
import {
  ArchiveBoxArrowDownIcon,
  ArrowUpOnSquareIcon,
  ArchiveBoxXMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

export function TaskActions({
  classId,
  configId,
  userId,
  isArchived,
  isPublished,
  type,
}: {
  classId: string;
  configId: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
  type: TaskType;
}) {
  const { duplicateConfig } = useDuplicateConfig();
  const archivedIcon = isArchived ? (
    <ArrowUpOnSquareIcon className="w-4 text-primary " />
  ) : (
    <ArchiveBoxArrowDownIcon className="w-4 text-destructive" />
  );

  const archivingHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isArchived) {
      db.bot.unArchiveAllBotsOfBotConfig(configId);
    } else {
      db.bot.archiveAllBotsOfBotConfig(configId);
    }
  };

  return (
    <div className="flex gap-2 justify-end w-full">
      {!isArchived && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  duplicateConfig({ classId, configId, userId, type });
                }}
              >
                <DocumentDuplicateIcon className="w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-500 text-slate-100">
              <p>Create Copy</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!isPublished && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={archivingHandler}
              >
                {archivedIcon}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-500 text-slate-100">
              <p>{isArchived ? "Unarchive" : "Archive"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
