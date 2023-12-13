import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "../../../routers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { getClassURL } from "@/lib/urls";

export default async function ClassLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col h-full w-full">
        <div className="h-20 flex items-center justify-start bg-base-300 ">
          <Link href={getClassURL(classId)}>
            <Button
              className="flex items-center gap-1 hover:bg-base-300 hover:text-slate-100 hover:font-semibold"
              variant="ghost"
              size="sm"
            >
              <ChevronLeftIcon className="w-8 h-8" />
              <div>Back</div>
            </Button>
          </Link>
        </div>
        <div className="w-full overflow-y-auto custom-scrollbar bg-base-200">
          <div className="w-full bg-base-300 shadow-sm shadow-base-100 pb-10 min-h-screen">
            {children}
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
}
