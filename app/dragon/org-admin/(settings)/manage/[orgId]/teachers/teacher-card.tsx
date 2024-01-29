"use client";
import { Card, Flex, Text, Title } from "@tremor/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeachersInOrg } from "@/app/dragon/org-admin/queries";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/icons";
import { db } from "@/lib/routers";
type NonNullableTeachersInOrg = NonNullable<TeachersInOrg>;

export const TeacherCard = function ({
  teacher,
}: {
  teacher: NonNullableTeachersInOrg[number];
}) {
  return (
    <Card key={teacher.id} className="my-3 flex flex-row items-center">
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
      <Button
        onClick={() => db.org.removeTeacherFromOrg({ userId: teacher.userId })}
        variant={"ghost"}
        size={"icon"}
      >
        <DeleteIcon size="sm" />
      </Button>
    </Card>
  );
};
