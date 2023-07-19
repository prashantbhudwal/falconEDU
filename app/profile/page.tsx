"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import Section from "../components/Section";
import { RotateLoader } from "react-spinners";
import EditProfileModal from "./edit/Modal";
async function fetchUserData(url: any) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
}

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession();
  const email = session?.user?.email;

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(email ? `/api/db/user/${email}` : null, fetchUserData);
  console.log(user);

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center">
        <RotateLoader color="#2d9c6d" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 w-5/6 rounded-lg ring ring-primary shadow-sm max-w-5xl">
      <div className="max-w-4xl mx-auto">
        <div className="relative px-6 py-10 mb-6 flex items-center space-x-6 bg-emerald-900 w-full rounded-lg">
          <div className="flex-shrink-0">
            {user.image ? (
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
              <h2 className="text-3xl">{user.name}</h2>

              <span className="badge badge-accent -mt-1 ml-2">
                {user.role === "PRO" ? "PRO" : "TRIAL"}
              </span>
            </div>
            <p className="text-lg text-slate-300">
              {!user?.teacherProfile?.bio
                ? "Your Headline"
                : user?.teacherProfile?.bio}
            </p>
          </div>
          <div className="absolute top-0 right-0 mt-4 mr-6 pr-4">
            <EditProfileModal />
          </div>
        </div>
        <Section title="Contact" className="p-6 rounded-md text-slate-400">
          <div className="grid grid-cols-2 gap-4 text-xl">
            <div>
              <p className="font-bold text-slate-200">Email</p>
              <p>{user?.email}</p>
            </div>
          </div>
        </Section>
        <Section title="Subscription" className="p-6 rounded-md text-slate-400">
          <div className="grid grid-cols-2 gap-4 text-xl">
            <div>
              <p className="font-bold text-slate-200">Plan</p>
              <p>{user?.plan ? user?.plan : "Plan"}</p>
            </div>
            <div>
              <p className="font-bold text-slate-200">Start Date</p>
              <p>
                {user?.subscriptionStart
                  ? new Date(user?.subscriptionStart)
                      .toISOString()
                      .split("T")[0]
                  : "Start Date"}
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-200">End Date</p>
              <p>
                {user?.subscriptionEnd
                  ? new Date(user?.subscriptionEnd).toISOString().split("T")[0]
                  : "End Date"}
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
