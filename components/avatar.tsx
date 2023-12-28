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
      <Avatar>
        <AvatarImage src="/chubbi.png" />
      </Avatar>
    );
  }

  return (
    <>
      {user?.image ? (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user.image}  />
        </Avatar>
      ) : (
        <span className=" flex h-[35px] w-[35px] items-center justify-center rounded-full bg-slate-800 text-sm font-medium tracking-wide text-secondary shadow-md shadow-slate-950">
          <div>{getInitials()}</div>
        </span>
      )}
    </>
  );
}
