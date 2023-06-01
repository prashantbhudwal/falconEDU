"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import { Teacher } from "@prisma/client";
import Image from "next/image";

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

  const { data: user, error } = useSWR<Teacher>(
    email ? `/api/db/user/${email}` : null,
    fetchUserData
  );

  if (sessionStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="p-6  mb-6 flex items-center space-x-6 ">
          <div className="flex-shrink-0">
            <Image
              className="rounded-full object-cover"
              src={"/chubbi.png"}
              height={45}
              width={45}
              alt="Falcon Logo"
            />
          </div>
          <div>
            <div className="inline-flex items-start space-x-2">
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              {user?.accountType === "PRO" && (
                <span className="text-sm bg-emerald-300 text-emerald-800 px-2 py-1 rounded -mt-1 ml-2">
                  Pro
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-md border-2 border-emerald-500">
          <p className="text-xl mb-2">Email: {user?.email}</p>
          <p className="text-xl mb-2">Phone: {user?.phone}</p>
        </div>
      </div>
    </div>
  );
}
