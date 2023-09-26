import Navbar from "@/components/navbar/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { notFound } from "next/navigation";
export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.userType !== "STUDENT") notFound();
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex flex-col flex-1">{children}</main>
    </div>
  );
}
