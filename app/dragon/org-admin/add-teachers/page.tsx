import React from "react";
import AddTeacherForm from "../_components/add-teacher-form";
import AdminNavbar from "../_components/admin-navbar";
import { Text } from "@tremor/react";

const AddTeacherPage = () => {
  return (
    <>
      <AdminNavbar title="Add Teacher" />
      <div className="w-11/12 mx-auto">
        <Text className="font-semibold text-slate-200 flex gap-5 items-center">
          Teachers{" "}
        </Text>
        <AddTeacherForm />
      </div>
      {/* <DataTable students={students || []} classId={classId} /> */}
    </>
  );
};

export default AddTeacherPage;
