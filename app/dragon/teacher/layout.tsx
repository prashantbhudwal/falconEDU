import Navbar from "@/components/navbar/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { notFound } from "next/navigation";

export const metadata = {
  manifest: "/manifest-teacher.json",
};

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen w-full">{children}</main>;
}
