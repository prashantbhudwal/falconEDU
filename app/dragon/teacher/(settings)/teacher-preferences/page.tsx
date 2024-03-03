import TeacherPreferencesForm from "./teacher-preferences-form";
import { getTeacherData, typeGetTeacherPreferences } from "./getTeacherData";
import { Paper } from "@/components/ui/paper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="m-8 bg-base-200 p-5">
      <CardContent className="py-4">
        <TeacherPreferencesForm
          initialValues={preferences || {}}
          teacherId={teacherId}
        />
      </CardContent>
    </Card>
  );
}
