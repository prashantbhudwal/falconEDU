"use client";
import Image from "next/image";
import Section from "@/components/section";
import { RotateLoader } from "react-spinners";
import useUserData from "@/hooks/useUserData";
import EditProfileModal from "./edit/modal";
import { getFormattedDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function BasicInfo() {
  const { user, error, isLoading } = useUserData();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RotateLoader color="#2d9c6d" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }
  return (
    <div className=" w-full bg-slate-900 pb-4 text-text-200 shadow-sm ">
      <div className="relative mb-6 flex flex-col w-full gap-3  rounded-sm bg-base-100 py-4">
        <div className="shrink-0 w-[80%] mx-auto">
          {user?.image ? (
            <Image
              className="rounded-full object-cover"
              src={user.image}
              height={60}
              width={60}
              alt="Falcon Logo"
            />
          ) : (
            <Image
              className="rounded-full object-cover"
              src={"/chubbi.png"}
              height={60}
              width={60}
              alt="Falcon Logo"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 w-[80%] mx-auto">
          <h2 className="text-xl">{user?.name}</h2>
          <p className="text-base text-text-300">
            {!user?.teacherProfile?.bio
              ? "Your Headline"
              : user?.teacherProfile?.bio}
          </p>
        </div>
        <div className="absolute right-0 top-0 mr-6 mt-4 pr-4">
          <EditProfileModal />
        </div>
      </div>
      <Section
        title="Contact"
        className="rounded-md py-6 w-[80%] mx-auto text-text-400"
      >
        <div className="">
          <div>
            <p className="font-bold text-text-200">Email</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </Section>
      <Separator className="bg-slate-400 w-[80%] m-auto" />
      <Section
        title="Subscription"
        className="rounded-md py-6 w-[80%] mx-auto text-text-400 mt-5"
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold capitalize text-text-200">Plan</p>
            <p>{user?.role ? user?.role : "Plan"}</p>
          </div>
          <div>
            <p className="font-bold text-text-200">Start Date</p>
            <p>
              {user?.subscriptionStart
                ? getFormattedDate(user?.subscriptionStart)
                : "Start Date"}
            </p>
          </div>
          <div>
            <p className="font-bold text-text-200">End Date</p>
            <p>
              {user?.subscriptionEnd
                ? getFormattedDate(user?.subscriptionEnd)
                : "End Date"}
            </p>
          </div>
        </div>
      </Section>
      <Separator className="bg-slate-400 w-[80%] m-auto" />
    </div>
  );
}
