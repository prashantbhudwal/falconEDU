"use client";
import { Card, Flex, Text, Title } from "@tremor/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/icons";
import { db } from "@/lib/routers";

export const UserManagementCard = function ({
  name,
  email,
  image,
  userId,
  removeUserFunction,
}: {
  name: string;
  email: string;
  image: string | null;
  userId: string;
  removeUserFunction: ({ userId }: { userId: string }) => void;
}) {
  return (
    <Card className="my-3 flex flex-row items-center">
      <Flex className="gap-5">
        <Avatar>
          <AvatarImage src={image || "/chubbi.png"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Flex flexDirection="col" alignItems="start" className="gap-2">
          <Title>{name}</Title>
          <Text>{email}</Text>
        </Flex>
      </Flex>
      <Button
        onClick={() => removeUserFunction({ userId: userId })}
        variant={"ghost"}
        size={"icon"}
      >
        <DeleteIcon size="sm" />
      </Button>
    </Card>
  );
};
