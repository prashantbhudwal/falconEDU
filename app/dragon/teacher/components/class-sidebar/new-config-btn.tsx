"use client";
import { Button } from "@/components/ui/button";
import { getEditBotURL, getTestEditBotURL } from "@/lib/urls";
import { db } from "../../routers";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export const NewConfigButton = function ({
  classId,
  layoutSegment,
}: {
  classId: string;
  layoutSegment: string;
}) {
  const router = useRouter();
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const createNewConfig = async (
    userId: string,
    classId: string,
    layoutSegment: string
  ) => {
    const configName =
      layoutSegment === "bots" ? "Untitled Bot" : "Untitled Test";
    const configType = layoutSegment === "bots" ? "chat" : "test";
    const botConfig = await db.botConfig.createBotConfig({
      userId,
      classId,
      configName,
      configType,
    });
    const configId = botConfig?.id;
    if (!configId) {
      throw new Error("Failed to create bot config");
    }
    router.push(
      configType === "chat"
        ? getEditBotURL(classId, configId)
        : getTestEditBotURL(classId, configId)
    );
  };
  return (
    <Button
      variant={"ghost"}
      className="px-2 capitalize flex items-center justify-start gap-3 w-full group-hover:text-slate-950 group"
      onClick={() => createNewConfig(userId, classId, layoutSegment)}
    >
      <PlusCircleIcon className="w-5 text-accent group-hover:text-inherit" />
      <div>New {layoutSegment.slice(0, -1)}</div>
    </Button>
  );
};
