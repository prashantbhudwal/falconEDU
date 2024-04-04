"use client";
import React, { useEffect, useRef, useState } from "react";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { LuArchive } from "react-icons/lu";
import { BoltIcon } from "@heroicons/react/24/solid";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getTeacherHomeURL } from "@/lib/urls";
import { db } from "@/lib/routers";

export const ToggleClassStatusCard = ({ classId }: { classId: string }) => {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(true);

  const onCardClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  useEffect(() => {
    (async () => {
      const isActive = await db.class.getClassIsActiveByClassId(classId);
      setIsActive(isActive);
    })();
  }, []);

  const archiveHandler = async (type: string) => {
    if (type === "archive") {
      const { success } = await db.class.archiveClassByClassId({ classId });
      if (success) {
        setIsActive(false);
        router.push(getTeacherHomeURL());
      }
    }
    if (type === "unarchive") {
      const { success } = await db.class.unarchiveClassByClassId({ classId });
      if (success) {
        setIsActive(true);
      }
    }
  };

  return (
    <Card
      onClick={onCardClick}
      className={cn(
        "flex w-[400px] items-center justify-start gap-5 pl-10 hover:cursor-pointer hover:text-base-100",
        {
          "bg-primary hover:bg-primary": !isActive,
          "hover:bg-destructive": isActive,
        },
      )}
    >
      {isActive ? (
        <ClassDialog
          title="Archive Class"
          description="Archiving the class archives all the bots and tests in the class. Students won't be able to use them."
          action={() => archiveHandler("archive")}
          trigger={
            <div ref={buttonRef}>
              <div className="flex items-center gap-4 text-lg">
                <LuArchive />
                Archive Class
              </div>
            </div>
          }
        />
      ) : (
        <ClassDialog
          title="Activate Class"
          description="Activating the class will make all the bots and tests in the class available to the students."
          action={() => archiveHandler("unarchive")}
          trigger={
            <div ref={buttonRef}>
              <div
                className={cn("flex items-center gap-4 text-lg", {
                  "text-base-100": !isActive,
                })}
              >
                <BoltIcon className="w-6" />
                Activate Class
              </div>
            </div>
          }
        />
      )}
    </Card>
  );
};
