import React from "react";
import { StudentPreferencesForm } from "./preferences-form";

const PreferencesPage: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 items-center">
      <h1 className="text-3xl font-bold text-center">About Me</h1>
      <StudentPreferencesForm />
    </div>
  );
};

export default PreferencesPage;
