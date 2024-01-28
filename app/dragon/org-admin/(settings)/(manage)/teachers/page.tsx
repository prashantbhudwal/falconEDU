import React from "react";
import AddTeacherForm from "../../../_components/add-teacher-form";
import { getTeachersWithUserId } from "../../../queries";
import { Card, Flex, Text, Title } from "@tremor/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { TestOverflow } from "@/components/test-overflow";

export default async function AddTeacherPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  const teachers = await getTeachersWithUserId({ userId });
  return (
    <>
      <div className="mx-auto my-10 w-11/12">
        <AddTeacherForm />
        {teachers?.map((teacher) => (
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
        ))}
      </div>
    </>
  );
}
