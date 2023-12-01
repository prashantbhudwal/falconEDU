import AddStudentForm from "./add-students-form";
import { getStudentsByClassId } from "../../../queries";
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
  const students = await getStudentsByClassId(classId);
  return (
    <Paper
      className="flex flex-col gap-10 w-full max-w-5xl min-h-screen"
      variant={"gray"}
    >
      <h1 className="text-3xl font-bold  text-slate-400">My Students</h1>
      <div className="flex space-y-5 flex-col w-full">
        <AddStudentForm classId={classId} />
        <DataTable students={students || []} />
      </div>
    </Paper>
  );
}
