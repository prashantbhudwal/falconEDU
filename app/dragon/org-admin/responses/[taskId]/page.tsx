import { AvatarNavbar } from "@/app/dragon/student/components/student-navbar";
import React from "react";
import AdminNavbar from "../../_components/admin-navbar";
import { getStudentSubmissionsStatsByTaskId } from "../../queries";
import { Card, Flex, Text, Title } from "@tremor/react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

const ResponsesPage = async ({ params }: { params: { taskId: string } }) => {
  const students = await getStudentSubmissionsStatsByTaskId({
    taskId: params.taskId,
  });

  return (
    <div>
      <AdminNavbar title="Responses" />
      <div className="w-11/12 mx-auto">
        <Flex className="my-10 gap-3" flexDirection="col">
          {students &&
            students.length > 0 &&
            students.map((student) => {
              return (
                <Card key={student.email}>
                  <Flex className="gap-3">
                    <Avatar>
                      <AvatarImage src={student.image || "/chubbi.png"} />
                      <AvatarFallback>
                        {student.name?.split("")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Flex flexDirection="col" alignItems="start">
                      <Title>{student.name}</Title>
                      <Text className="text-xs w-11/12 truncate">
                        {student.email}
                      </Text>
                    </Flex>
                    <Text>
                      {student.isRead ? (
                        <span className="text-success">Attempted</span>
                      ) : (
                        <span className="text-warning">Pending</span>
                      )}
                    </Text>
                  </Flex>
                </Card>
              );
            })}
        </Flex>
      </div>
    </div>
  );
};

export default ResponsesPage;
