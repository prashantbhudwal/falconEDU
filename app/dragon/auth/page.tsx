import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const CustomLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Link
      className={cn(
        "flex h-full w-full flex-col justify-center bg-base-300 px-8 text-center text-5xl font-bold text-primary hover:bg-base-100",
        className,
      )}
      href={href}
    >
      <div>{children}</div>
    </Link>
  );
};
const teacherLoginRoute = "/dragon/auth/teacher";
const studentLoginRoute = "/dragon/auth/student";
export default async function DragonLogin() {
  const session = await getServerSession(authOptions);
  if (session) {
    if (session?.user.userType === "TEACHER")
      return redirect("/dragon/teacher");
    return redirect("/dragon/student");
  }

  return (
    <div className="bg-dark flex h-screen min-w-full flex-col items-center justify-center">
      <CustomLink href={teacherLoginRoute} className="text-secondary">
        Teacher
      </CustomLink>
      <Separator />
      <CustomLink href={studentLoginRoute}>Student</CustomLink>
    </div>
  );
}
