"use client";
import Image from "next/image";
import useUserData from "@/hooks/useUserData";

export default function Avatar() {
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
      <Image
        className="rounded-md object-cover"
        src={"/chubbi.png"}
        height={35}
        width={35}
        alt="Falcon Logo"
      />
    );
  }

  return (
    <>
      {user?.image ? (
        <Image
          className="rounded-full object-cover"
          src={user.image}
          height={35}
          width={35}
          alt="User avatar"
        />
      ) : (
        <span className=" bg-slate-800 shadow-md shadow-slate-950 text-sm text-secondary font-medium rounded-full w-[35px] h-[35px] flex items-center justify-center tracking-wide">
          <div>{getInitials()}</div>
        </span>
      )}
    </>
  );
}
