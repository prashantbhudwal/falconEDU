import AddStudentForm from "./add-students-form";
import { getStudentsByClassId } from "../../../../queries";
import { DataTable } from "./dataTable";
import { _TestOverflow } from "@/components/_test-overflow";
import { Paper } from "@/components/ui/paper";

export const revalidate = 3600; // revalidate the data at most every hour

type EditClassProps = {
  params: {
    classId: string;
  };
};
export default async function EditStudents({ params }: EditClassProps) {
  const { classId } = params;
  const { students, nameOfClass } = await getStudentsByClassId(classId);
  return (
    <Paper className="flex flex-col gap-10 w-full max-w-5xl min-h-screen">
      <div className="flex flex-col space-y-2 items-baseline text-3xl justify-between">
        <h1 className=" font-semibold text-slate-200">Students</h1>
        <span className="text-xl text-slate-500"> Class: {nameOfClass}</span>
      </div>

      <div className="flex space-y-5 flex-col w-full">
        <AddStudentForm classId={classId} />
        <DataTable students={students || []} classId={classId} />
      </div>
    </Paper>
  );
}
