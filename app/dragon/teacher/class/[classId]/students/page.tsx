import ClassForm from "./add-students-form";
import { StudentTable } from "./students-table";
import { getStudentsByClassId } from "../../../queries";

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
    <div className="flex flex-col gap-10">
      <div className="mx-auto mt-4">
        <ClassForm />
      </div>
      <StudentTable students={students} />
    </div>
  );
}
