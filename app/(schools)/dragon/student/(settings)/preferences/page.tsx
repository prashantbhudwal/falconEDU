import React from "react";
import { StudentPreferencesForm } from "./preferences-form";
import { getStudentData, typeGetStudentPreferences } from "./getStudentData";

const PreferencesPage: React.FC = async () => {
  const { preferences, studentId } = (await getStudentData()) as {
    preferences: typeGetStudentPreferences;
    studentId: string;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-center text-3xl font-bold">My Profile</h1>
      <p className="text-center text-gray-500">
        Tell the teachers about yourself.
      </p>
      <StudentPreferencesForm
        initialPreferences={preferences || {}}
        studentId={studentId}
      />
    </div>
  );
};

export default PreferencesPage;
