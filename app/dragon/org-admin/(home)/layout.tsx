import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { BottomNav } from "../components/bottom-nav";
import { AdminNavbar } from "../components/navbar";
import { db } from "@/lib/routers";

export const metadata = {
  manifest: "/manifest-teacher.json",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const org = await db.admin.org.getOrgByUserId(userId);
  const name = org?.name;
  if (session?.user?.userType !== "ORG_ADMIN") notFound();
  return (
    <main className="min-h-screen w-full">
      <div className="flex h-screen min-w-full flex-col">
        <AdminNavbar title={name && name?.length > 0 ? name : "Home"} />
        <div className="custom-scrollbar overflow-y-auto px-2 pb-32 pt-3">
          {children}
        </div>
        <BottomNav />
      </div>
    </main>
  );
}
