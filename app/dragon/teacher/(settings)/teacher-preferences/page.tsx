import TeacherPreferencesForm from "./teacher-preferences-form";
import { getTeacherData, typeGetTeacherPreferences } from "./getTeacherData";

type TeacherPreferencesPageProps = {
  params: {
    classId: string;
  };
};

export default async function TeacherPreferencesPage({
  params,
}: TeacherPreferencesPageProps) {
  const { preferences, teacherId } = (await getTeacherData()) as {
    preferences: typeGetTeacherPreferences;
    teacherId: string;
  };

  return (
    <div className=" h-full w-full overflow-y-scroll">
      <TeacherPreferencesForm
        initialValues={preferences || {}}
        teacherId={teacherId}
      />
    </div>
  );
}
