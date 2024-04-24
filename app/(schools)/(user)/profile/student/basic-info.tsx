"use client";
import Image from "next/image";
import Section from "@/components/section";
import { RotateLoader } from "react-spinners";
import useUserData from "@/hooks/useUserData";
import EditProfileModal from "./edit/modal";
import { formatDate } from "@/lib/utils";
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
    <div className=" w-full bg-slate-900 pb-4 text-slate-200 shadow-sm ">
      <div className="relative mb-6 flex w-full flex-col gap-3  rounded-sm bg-base-100 py-4">
        <div className="mx-auto w-[80%] shrink-0">
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
        <div className="mx-auto flex w-[80%] flex-col gap-2">
          <h2 className="text-xl">{user?.name}</h2>
          <p className="text-base text-slate-300">
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
        className="mx-auto w-[80%] rounded-md py-6 text-slate-400"
      >
        <div className="">
          <div>
            <p className="font-bold text-slate-200">Email</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </Section>
      <Separator className="m-auto w-[80%] bg-slate-400" />
      <Section
        title="Subscription"
        className="mx-auto mt-5 w-[80%] rounded-md py-6 text-slate-400"
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold capitalize text-slate-200">Plan</p>
            <p>{user?.role ? user?.role : "Plan"}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">Start Date</p>
            <p>
              {user?.subscriptionStart
                ? formatDate(new Date(user?.subscriptionStart))
                : "Start Date"}
            </p>
          </div>
          <div>
            <p className="font-bold text-slate-200">End Date</p>
            <p>
              {user?.subscriptionEnd
                ? formatDate(new Date(user?.subscriptionEnd))
                : "End Date"}
            </p>
          </div>
        </div>
      </Section>
      <Separator className="m-auto w-[80%] bg-slate-400" />
    </div>
  );
}
