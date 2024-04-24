import Navbar from "@/components/navbar/navbar";
import Expired from "../../../components/auth/expired";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
export default async function ToolsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.userType !== "TEACHER") return notFound();
  return (
    <Expired>
      <div className="flex h-screen min-w-full flex-col">
        <Navbar />
        {children}
      </div>
    </Expired>
  );
}
