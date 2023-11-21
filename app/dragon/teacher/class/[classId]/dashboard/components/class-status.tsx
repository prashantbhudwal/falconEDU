"use client";
import React, { useEffect, useState } from "react";
import { getClassIsActiveByClassId } from "../queries";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { Button } from "@/components/ui/button";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
import { archiveClassByClassId, unarchiveClassByClassId } from "../mutations";

const ClassStatus = ({ classId }: { classId: string }) => {
  const [isActive, setIsActive] = useState(true);

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
    <div className="flex items-center gap-5">
      {isActive ? (
        <ClassDialog
          title="Archive Class"
          description="This action will Archive the class and all the Test/Bots will become Inactive "
          action={() => archiveHandler("archive")}
          trigger={
            <Button
              variant={"outline"}
              size={"icon"}
              className="hover:bg-destructive"
            >
              <LuArchive />
            </Button>
          }
        />
      ) : (
        <ClassDialog
          title="Unarchive Class"
          description="This action will Unarchive the class and all the Test/Bots will become Active "
          action={() => archiveHandler("unarchive")}
          trigger={
            <Button
              variant={"outline"}
              size={"icon"}
              className="hover:bg-destructive"
            >
              <LuArchiveRestore />
            </Button>
          }
        />
      )}
      <div className="text-[10px] flex flex-col items-end">
        <p className="font-semibold text-[18px] flex items-center gap-2">
          <span
            className={`p-[6px] rounded-full ${
              isActive ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          {isActive ? "Active" : "Archived"}
        </p>
      </div>
    </div>
  );
};

export default ClassStatus;
