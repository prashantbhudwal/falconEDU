"use client";
import { useDuplicateConfig } from "@/app/dragon/teacher/hooks/use-duplicate-config";
import { db } from "@/app/dragon/teacher/routers";
import { Button } from "@/components/ui/button";
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
}: {
  classId: string;
  configId: string;
  userId: string;
  isArchived: boolean;
}) {
  const { duplicateConfig } = useDuplicateConfig();
  const archivedIcon = !isArchived ? (
    <ArrowUpOnSquareIcon className="w-4 text-primary " />
  ) : (
    <ArchiveBoxArrowDownIcon className="w-4 text-destructive" />
  );
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => duplicateConfig({ classId, configId, userId })}
      >
        <DocumentDuplicateIcon className="w-4" />
      </Button>
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          isArchived
            ? db.bot.unArchiveAllBotsOfBotConfig(configId)
            : db.bot.archiveAllBotsOfBotConfig(configId)
        }
      >
        {archivedIcon}
      </Button> */}
    </div>
  );
}
