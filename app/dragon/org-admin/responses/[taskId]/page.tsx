import React from "react";
import { AdminNavbar } from "../../components/navbar";
import { Card, Flex, Text, Title } from "@tremor/react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { db } from "@/lib/routers";

const ResponsesPage = async ({ params }: { params: { taskId: string } }) => {
  const students = await db.admin.task.getStudentSubmissionsStatsByTaskId({
    taskId: params.taskId,
  });

  return (
    <div className="flex h-screen min-w-full flex-col">
      <AdminNavbar title="Responses" />
      <div className="custom-scrollbar overflow-y-auto px-2">
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
                      <Text className="w-11/12 truncate text-xs">
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
