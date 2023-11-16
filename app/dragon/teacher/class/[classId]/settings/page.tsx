"use client";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "../../../components/delete-dialog";
import { deleteClassByClassId } from "../../../mutations";
import { LuArchive } from "react-icons/lu";
import { ClassDialog } from "../../../components/class-dialog";
import { archiveClassByClassId, updateClassNameByClassId } from "./mutations";
import { ChangeEvent, useEffect, useState } from "react";
import { getClassNameByClassId } from "../utils";

export default function ClassSettings({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const [className, setClassName] = useState("");

  useEffect(() => {
    (async () => {
      const nameOfClass = await getClassNameByClassId(classId);
      setClassName(nameOfClass);
    })();
  }, [classId]);

  const onClassNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const updateClassNameHandler = async () => {
    const response = await updateClassNameByClassId(classId, className);
  };

  return (
    <div>
      <input
        type="text"
        value={className}
        onChange={onClassNameChange}
        onBlur={updateClassNameHandler}
        className="outline-none border-none md:text-3xl pl-0 font-bold tracking-wide bg-transparent"
      />
      <div className="flex justify-end min-w-[260px]">
        <ClassDialog
          title="Archive Class"
          description="This action will Archive the class and all the Test/Bots will become Inactive "
          action={() => archiveClassByClassId(classId)}
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
      </div>
    </div>
  );
}
