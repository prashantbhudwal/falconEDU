"use client";
import Image from "next/image";
import useUserData from "@/hooks/useUserData";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function UserAvatar() {
  const { user, error, isLoading } = useUserData();

  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.trim().split(" ");
      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      } else if (nameParts.length > 1) {
        return (
          nameParts[0].charAt(0).toUpperCase() +
          nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        );
      }
    }
    return "";
  };

  if (isLoading) {
    return (
      <Avatar className="h-5 w-5">
        <AvatarImage src="/chubbi.png" />
      </Avatar>
    );
  }

  return (
    <>
      {user?.image ? (
        <Avatar className="h-5 w-5">
          <AvatarImage src={user.image} />
        </Avatar>
      ) : (
        <span className=" flex h-[30px] w-[30px] items-center justify-center rounded-full border text-sm font-medium tracking-wide text-secondary">
          <div className="text-xs lowercase">{getInitials()}</div>
        </span>
      )}
    </>
  );
}
