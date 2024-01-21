"use client";
import { db } from "@/lib/routers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const VerifyInviteButton = ({
  studentEmail,
  classId,
  inviteId,
}: {
  studentEmail: string;
  classId: string;
  inviteId: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const joinClassHandler = async () => {
    setLoading(true);
    const { success } = await db.studentRouter.addStudentToClass({
      email: studentEmail,
      classId,
    });
    if (success) {
      const { updatedInvitation } =
        await db.inviteStudentsRouter.updateInvitationStausByInviteId({
          inviteId,
          status: "ACCEPTED",
        });
      router.push("/dragon/student");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Button
      className="w-fit min-w-[150px] disabled:cursor-not-allowed disabled:opacity-40"
      disabled={loading}
      onClick={joinClassHandler}
    >
      {loading ? (
        <span className="loading loading-infinity loading-sm"></span>
      ) : (
        "Join Class"
      )}
    </Button>
  );
};
