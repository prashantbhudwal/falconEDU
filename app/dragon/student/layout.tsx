import Navbar from "@/components/navbar/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { notFound } from "next/navigation";
import { PWAProvider } from "@/components/pwa-context-provider";

export const metadata = {
  manifest: "/manifest-student.json",
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.userType !== "STUDENT") notFound();
  return (
    <div className="flex min-h-screen w-full flex-col bg-base-300">
      <PWAProvider>
        <main className="flex flex-1 flex-col">{children}</main>
      </PWAProvider>
    </div>
  );
}
