"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/app/dragon/teacher/routers";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

export const NewAttemptButton = ({
  botId,
  className,
}: {
  botId: string;
  className?: string;
}) => {
  const createHandler = async (e: React.MouseEvent) => {
    await db.botChatRouter.createBotChat({
      botId: botId,
    });
  };

  return (
    <Button
      variant="secondary"
      size={"lg"}
      onClick={createHandler}
      className={cn(
        "flex items-center gap-2 rounded-full border border-base-100 text-xs font-semibold",
        className,
      )}
    >
      <ArrowUpIcon className="w-4" /> Attempt
    </Button>
  );
};
