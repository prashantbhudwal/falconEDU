import AddStudentForm from "./add-students-form";
import { DataTable } from "./data-table";
import { Paper } from "@/components/ui/paper";
import { InvitedStudents } from "./invited-students";
import { HiOutlineInboxStack } from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/routers";

export const revalidate = 3600; // revalidate the data at most every hour

type EditClassProps = {
  params: {
    classId: string;
  };
};
export default async function EditStudents({ params }: EditClassProps) {
  const { classId } = params;
  const { students, nameOfClass } =
    await db.class.getStudentsByClassId(classId);
  const { inviteList } = await db.inviteStudentsRouter.getInviteList({
    classId,
  });

  return (
    <Paper className="flex min-h-screen w-full max-w-5xl flex-col gap-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-baseline justify-between space-y-2 text-3xl">
          <h1 className="flex items-center gap-5 font-semibold text-slate-200">
            Students{" "}
            <div className="-translate-y-[2px]">
              <AddStudentForm
                classId={classId}
                nameOfClass={nameOfClass || "Falcon"}
              />
            </div>
          </h1>
          <span className="text-xl text-slate-500"> Class: {nameOfClass}</span>
        </div>
        {Array.isArray(inviteList) && inviteList.length > 0 && (
          <Dialog>
            <DialogTrigger>
              <div className="flex cursor-pointer items-center gap-3 rounded-3xl bg-base-100 px-5 py-3">
                <HiOutlineInboxStack className="text-3xl" />
                <h5 className="text-xs font-semibold">
                  Invited <br /> Students
                </h5>
              </div>
            </DialogTrigger>
            <DialogContent className="min-w-[900px]">
              <DialogHeader>
                <div className="pt-5">
                  <h4 className="mb-5 text-2xl font-semibold tracking-wide">
                    Invited Students
                  </h4>
                  <InvitedStudents inviteList={inviteList} />
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <DataTable students={students || []} classId={classId} />
    </Paper>
  );
}
