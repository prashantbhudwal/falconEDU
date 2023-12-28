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
        "font-semibold flex items-center border border-base-100 gap-2 text-xs rounded-full",
        className
      )}
    >
      <ArrowUpIcon className="w-4" /> Attempt
    </Button>
  );
};
