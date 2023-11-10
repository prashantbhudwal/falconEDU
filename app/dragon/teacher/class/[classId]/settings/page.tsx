"use client";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "../../../components/delete-dialog";
import { deleteClassByClassId } from "../../../mutations";
import { FiTrash } from "react-icons/fi";

export default function ClassSettings({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Class Settings</h1>
      <div className="flex justify-end min-w-[260px]">
        <DeleteDialog
          title="Delete Class"
          description="Are you sure you want to delete this class? This action can't be reversed."
          action={() => deleteClassByClassId(classId)}
          trigger={
            <Button
              variant={"outline"}
              size={"icon"}
              className="hover:bg-destructive"
            >
              <FiTrash />
            </Button>
          }
        />
      </div>
    </div>
  );
}
