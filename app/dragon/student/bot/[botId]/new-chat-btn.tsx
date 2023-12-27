"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/app/dragon/teacher/routers";
import { PlusIcon } from "@heroicons/react/24/solid";

export const NewChatButton = ({ botId }: { botId: string }) => {
  const createHandler = async (e: React.MouseEvent) => {
    await db.botChatRouter.createBotChat({
      botId: botId,
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={createHandler}
      className="flex items-center border border-base-100 gap-2 text-xs"
    >
      <PlusIcon className="w-4" /> New Attempt
    </Button>
  );
};
