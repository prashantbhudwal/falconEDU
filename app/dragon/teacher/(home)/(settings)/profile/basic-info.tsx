import Image from "next/image";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function BasicInfo() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className=" w-full bg-slate-900 pb-4 text-slate-200 shadow-sm">
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
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2 rounded-md p-6 text-slate-400">
        <div className="grid grid-cols-2 gap-4 ">
          <div>
            <p className="font-bold text-slate-200">Email</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
