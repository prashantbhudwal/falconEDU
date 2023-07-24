"use client";
import Image from "next/image";
import useUserData from "@/hooks/useUserData";

export default function Avatar() {
  const { user, error, isLoading } = useUserData();
  return (
    <>
      {user?.image || !isLoading ? (
        <Image
          className="rounded-md object-cover"
          src={user.image}
          height={35}
          width={35}
          alt="User avatar"
        />
      ) : (
        <Image
          className="rounded-md object-cover"
          src={"/chubbi.png"}
          height={35}
          width={35}
          alt="Falcon Logo"
        />
      )}
    </>
  );
}
