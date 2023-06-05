"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import { Teacher } from "@prisma/client";
import Image from "next/image";
import Section from "../components/Section";
import { RotateLoader } from "react-spinners";

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
  } = useSWR<Teacher>(email ? `/api/db/user/${email}` : null, fetchUserData);

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
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 w-5/6 rounded-lg ring ring-primary shadow-sm ">
      <div className="max-w-4xl mx-auto">
        <div className="px-6 py-10 mb-6 flex items-center space-x-6 bg-emerald-900 w-full rounded-lg">
          <div className="flex-shrink-0">
            <Image
              className="rounded-full object-cover"
              src={"/chubbi.png"}
              height={75}
              width={75}
              alt="Falcon Logo"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-start space-x-2">
              <h2 className="text-3xl">{user?.name}</h2>
              {user?.accountType === "PRO" && (
                <span className="badge badge-accent -mt-1 ml-2">Pro</span>
              )}
            </div>
            <p className="text-xl text-slate-300">{user?.email}</p>
          </div>
        </div>
        <Section title="Contact" className="p-6 rounded-md text-slate-400">
          <table className="text-xl mb-2">
            <tbody>
              <tr className="mb-8">
                <td className="font-bold text-slate-200 mr-4">Email</td>
                <td>{user?.email}</td>
              </tr>
              <tr className="mb-8">
                <td className="font-bold text-slate-200 mr-4">Phone</td>
                <td>{user?.phone}</td>
              </tr>
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}
