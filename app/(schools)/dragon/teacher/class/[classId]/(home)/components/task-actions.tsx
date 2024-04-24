"use client";
import { useDuplicateConfig } from "@/app/(schools)/dragon/teacher/hooks/use-duplicate-config";
import { db } from "@/lib/routers";
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
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import Lottie from "lottie-react";
import { useState } from "react";
import copyingAnimation from "@/public/animations/copying.json";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { PropagationStopper } from "@/components/propagation-stopper";

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
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [open, setOpen] = useState(false);
  const archivedIcon = isArchived ? (
    <ArrowUpOnSquareIcon className="w-3 text-primary " />
  ) : (
    <ArchiveBoxArrowDownIcon className="w-3" />
  );

  const archivingHandler = (e: React.MouseEvent) => {
    if (isArchived) {
      db.bot.unArchiveAllBotsOfBotConfig(configId);
    } else {
      db.bot.archiveAllBotsOfBotConfig(configId);
    }
  };

  const duplicateHandler = async (e: React.MouseEvent) => {
    setOpen(true);
    setIsDuplicating(true);
    try {
      await duplicateConfig({ classId, configId, userId, type });
    } catch (err) {
      // handle error
      setOpen(false);
      setIsDuplicating(false);
    }
    // not setting the "isDuplicating" state to false, on successfully duplicating, cause the duplicateConfig function is redirecting it to another page
  };

  return (
    <div className="flex w-full justify-end gap-2">
      {!isArchived && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <PropagationStopper>
                <div onClick={duplicateHandler} className="hover:translate-y-1">
                  <DocumentDuplicateIcon className="w-3" />
                </div>
              </PropagationStopper>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-600 text-slate-100">
              <p>Create Copy</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!isPublished && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <PropagationStopper>
                <div onClick={archivingHandler} className="hover:translate-y-1">
                  {archivedIcon}
                </div>
              </PropagationStopper>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-600 text-slate-100">
              <p>{isArchived ? "Unarchive" : "Archive"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isDuplicating && open && (
        <PropagationStopper>
          <AlertDialog open={open}>
            <AlertDialogContent className="p-0">
              <Lottie className="h-[200px]" animationData={copyingAnimation} />
              <p className="-translate-y-10 text-center text-lg font-semibold">
                Generating Replica...
              </p>
            </AlertDialogContent>
          </AlertDialog>
        </PropagationStopper>
      )}
    </div>
  );
}
