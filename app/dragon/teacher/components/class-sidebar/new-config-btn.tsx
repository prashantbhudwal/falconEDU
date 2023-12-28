"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useCreateNewConfig } from "../../hooks/use-create-config";
import { PlusIcon } from "@radix-ui/react-icons";

export const NewConfigButton = function ({
  classId,
  layoutSegment,
}: {
  classId: string;
  layoutSegment: string;
}) {
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const configType = layoutSegment === "bots" ? "chat" : "test";
  const createNewConfig = useCreateNewConfig();
  return (
    <Button
      variant={"ghost"}
      className="px-2 capitalize flex items-center justify-start gap-3 w-full group-hover:text-text-950 group"
      onClick={() => createNewConfig({ userId, classId, configType })}
    >
      <PlusIcon className="w-5 text-accent group-hover:text-inherit" />
      <div>New {layoutSegment.slice(0, -1)}</div>
    </Button>
  );
};
