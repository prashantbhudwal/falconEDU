"use client";
import { db } from "@/app/dragon/teacher/routers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const CancelInviteButton = ({ inviteId }: { inviteId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const joinClassHandler = async () => {
    setLoading(true);
    const { updatedInvitation } =
      await db.inviteStudentsRouter.updateInvitationStausByInviteId({
        inviteId,
        status: "DECLINED",
      });
    router.push("/dragon/student");
    setLoading(false);
  };
  return (
    <Button
      className="w-fit disabled:opacity-40 min-w-[150px] disabled:cursor-not-allowed border border-slate-700 hover:bg-error"
      disabled={loading}
      onClick={joinClassHandler}
      variant={"ghost"}
    >
      Cancel Invite
    </Button>
  );
};
