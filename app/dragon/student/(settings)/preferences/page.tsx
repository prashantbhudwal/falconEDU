import React from "react";
import { StudentPreferencesForm } from "./preferences-form";
import { getStudentData, typeGetStudentPreferences } from "./getStudentData";

const PreferencesPage: React.FC = async () => {
  const { preferences, studentId } = (await getStudentData()) as {
    preferences: typeGetStudentPreferences;
    studentId: string;
  };

  return (
    <div className="flex flex-col space-y-4 items-center">
      <h1 className="text-3xl font-bold text-center">My Profile</h1>
      <p className="text-text-500 text-center">
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
