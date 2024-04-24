import TeacherPreferencesForm from "./teacher-preferences-form";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { db } from "@/lib/routers";

export default async function TeacherPreferencesPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const teacherData = await db.preferences.getTeacherPreferences({ userId });
  if (!teacherData) return null;
  const { preferences, teacherId } = teacherData;
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
