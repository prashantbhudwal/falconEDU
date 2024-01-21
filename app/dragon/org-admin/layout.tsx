import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export const metadata = {
  manifest: "/manifest-teacher.json",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.userType !== "ORG_ADMIN") notFound();
  return (
    <main className="custom-scrollbar h-screen min-h-screen w-full overflow-y-scroll">
      {children}
    </main>
  );
}
