"use client";
import Image from "next/image";
import Section from "@/components/section";
import { RotateLoader } from "react-spinners";
import useUserData from "@/hooks/useUserData";
import EditProfileModal from "./edit/modal";
import { getFormattedDate } from "@/lib/utils";

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
    <div className=" w-full bg-slate-900 pb-4 text-text-200 shadow-sm">
      <div className="relative mb-6 flex w-full items-center space-x-6 rounded-sm bg-base-100 px-6 py-10">
        <div className="shrink-0">
          {user?.image ? (
            <Image
              className="rounded-full object-cover"
              src={user.image}
              height={75}
              width={75}
              alt="Falcon Logo"
            />
          ) : (
            <Image
              className="rounded-full object-cover"
              src={"/chubbi.png"}
              height={75}
              width={75}
              alt="Falcon Logo"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-start space-x-2">
            <h2 className="text-3xl">{user?.name}</h2>
            <span className="badge badge-accent -mt-1 ml-2">
              {user?.role === "PRO" ? "PRO" : "TRIAL"}
            </span>
          </div>
          <p className="text-lg text-text-300">
            {!user?.teacherProfile?.bio
              ? "Your Headline"
              : user?.teacherProfile?.bio}
          </p>
        </div>
        <div className="absolute right-0 top-0 mr-6 mt-4 pr-4">
          <EditProfileModal />
        </div>
      </div>
      <Section title="Contact" className="rounded-md p-6 text-text-400">
        <div className="grid grid-cols-2 gap-4 ">
          <div>
            <p className="font-bold text-text-200">Email</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </Section>
      <Section title="Subscription" className="rounded-md p-6 text-text-400">
        <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
