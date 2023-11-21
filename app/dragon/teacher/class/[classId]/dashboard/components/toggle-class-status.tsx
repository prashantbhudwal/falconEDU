"use client";
import React, { useEffect, useRef, useState } from "react";
import { getClassIsActiveByClassId } from "../queries";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { Button } from "@/components/ui/button";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
import { archiveClassByClassId, unarchiveClassByClassId } from "../mutations";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const ToggleClassStatusCard = ({ classId }: { classId: string }) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(true);

  const onCardClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  useEffect(() => {
    (async () => {
      const isActive = await getClassIsActiveByClassId(classId);
      setIsActive(isActive);
    })();
  }, []);

  const archiveHandler = async (type: string) => {
    if (type === "archive") {
      const response = await archiveClassByClassId(classId);
      if (response) {
        setIsActive(false);
      }
    }
    if (type === "unarchive") {
      const response = await unarchiveClassByClassId(classId);
      if (response) {
        setIsActive(true);
      }
    }
  };

  return (
    <Card
      onClick={onCardClick}
      className={cn(
        "flex items-center gap-5 w-[400px] justify-start pl-10 hover:cursor-pointer hover:text-base-100",
        {
          "hover:bg-primary": !isActive,
          "hover:bg-destructive": isActive,
        }
      )}
    >
      {isActive ? (
        <ClassDialog
          title="Archive Class"
          description="This action will Archive the class and all the Test/Bots will become Inactive "
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
          title="Unarchive Class"
          description="This action will Unarchive the class and all the Test/Bots will become Active "
          action={() => archiveHandler("unarchive")}
          trigger={
            <div ref={buttonRef}>
              <div className="flex items-center gap-4 text-lg">
                <LuArchiveRestore />
                Archive Class
              </div>
            </div>
          }
        />
      )}
    </Card>
  );
};

