import React from "react";
import AddTeacherForm from "../_components/add-teacher-form";
import AdminNavbar from "../_components/admin-navbar";
import { Card, Flex, Text, Title } from "@tremor/react";
import { getTeacherWithOrgId } from "../queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AddTeacherPage = async () => {
  const allTeacher = await getTeacherWithOrgId();
  return (
    <>
      <AdminNavbar title="Add Teacher" />
      <div className="w-11/12 mx-auto my-10">
        <h2 className="font-semibold text-xl mb-2">Teachers</h2>
        <AddTeacherForm />
        {allTeacher?.map((teacher) => {
          return (
            <Card key={teacher.id} className="my-3">
              <Flex className="gap-5">
                <Avatar>
                  <AvatarImage src={teacher.User.image || "/chubbi.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Flex flexDirection="col" alignItems="start" className="gap-2">
                  <Title>{teacher.User.name}</Title>
                  <Text>{teacher.User.email}</Text>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </div>

      {/* <DataTable students={students || []} classId={classId} /> */}
    </>
  );
};

export default AddTeacherPage;
