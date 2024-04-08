import React from "react";
import { Card, Flex, Text, Title } from "@tremor/react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { db } from "@/lib/routers";
import { SetBackBar } from "@/components/back-bar/set-back-bar";
import { url } from "@/lib/urls";

const TaskPage = async ({
  params,
}: {
  params: { taskId: string; teacherId: string };
}) => {
  const { teacherId, taskId } = params;

  const students = await db.admin.task.getStudentSubmissionsStatsByTaskId({
    taskId,
  });

  return (
    <Flex className="my-10 gap-3" flexDirection="col">
      <SetBackBar
        title="Student Responses"
        url={url.orgAdmin.explore.teacher(teacherId)}
      />
      {students &&
        students.length > 0 &&
        students.map((student) => {
          return (
            <Card key={student.email}>
              <Flex className="gap-3">
                <Avatar>
                  <AvatarImage src={student.image || "/chubbi.png"} />
                  <AvatarFallback>{student.name?.split("")[0]}</AvatarFallback>
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
  );
};

export default TaskPage;
