import AddStudentForm from "./add-students-form";
import { getStudentsByClassId } from "../../../../queries";
import { DataTable } from "./dataTable";
import { _TestOverflow } from "@/components/_test-overflow";
import { Paper } from "@/components/ui/paper";
import { InvitedSudents } from "./invitedStudents";
import { HiOutlineInboxStack } from "react-icons/hi2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/app/dragon/teacher/routers";

export const revalidate = 3600; // revalidate the data at most every hour

type EditClassProps = {
  params: {
    classId: string;
  };
};
export default async function EditStudents({ params }: EditClassProps) {
  const { classId } = params;
  const { students, nameOfClass } = await getStudentsByClassId(classId);
  const { inviteList } = await db.inviteStudentsRouter.getInviteList({
    classId,
  });

  return (
    <Paper className="flex flex-col gap-10 w-full max-w-5xl min-h-screen">
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col space-y-2 items-baseline text-3xl justify-between">
          <h1 className="font-semibold text-slate-200 flex gap-5 items-center">
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
              <div className="rounded-3xl cursor-pointer bg-base-100 px-5 py-3 flex gap-3 items-center">
                <HiOutlineInboxStack className="text-3xl" />
                <h5 className="text-xs font-semibold">
                  Invited <br /> Students
                </h5>
              </div>
            </DialogTrigger>
            <DialogContent className="min-w-[900px]">
              <DialogHeader>
                <div className="pt-5">
                  <h4 className="text-2xl mb-5 font-semibold tracking-wide">
                    Invited Students
                  </h4>
                  <InvitedSudents inviteList={inviteList} />
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
