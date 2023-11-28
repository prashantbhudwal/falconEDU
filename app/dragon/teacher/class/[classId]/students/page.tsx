import AddStudentForm from "./add-students-form";
import { getStudentsByClassId } from "../../../queries";
import { DataTable } from "./dataTable";

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
    <div className="flex flex-col gap-10 w-full min-h-[calc(100vh-100px)] max-h-full overflow-y-scroll custom-scrollbar p-10">
      <div className="flex space-y-5 flex-col w-full">
        <AddStudentForm classId={classId} />
        <DataTable students={students || []} />
      </div>
    </div>
  );
}
