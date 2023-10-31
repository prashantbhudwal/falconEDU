import AddStudentForm from "./add-students-form";
import { getStudentsByClassId } from "../../../queries";
import { ItemCard } from "../../../components/item-card";
import { removeStudentFromClass } from "./mutations";
import { FiTrash } from "react-icons/fi";

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
        {students?.map((student) => {
          return (
            <ItemCard
              title={student.User.name!}
              key={student.id}
              avatarUrl={student.User.image!}
              actions={[
                {
                  title: "Delete Student",
                  description: "are you sure you want to delete this student?",
                  name: "Delete Student",
                  icon: <FiTrash />,
                  action: removeStudentFromClass,
                  actionParams: [student.id, student.classId!],
                },
              ]}
            >
              <span className="text-sm text-base-content">
                {student.User.email}
              </span>
            </ItemCard>
          );
        })}
      </div>
    </div>
  );
}
