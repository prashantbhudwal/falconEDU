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
        "text-5xl text-center text-primary px-8 font-bold hover:bg-base-100 bg-base-300 h-full w-full flex flex-col justify-center",
        className
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
    <div className="flex flex-col min-w-full h-screen justify-center items-center bg-dark">
      <CustomLink href={teacherLoginRoute} className="text-secondary">
        Teacher
      </CustomLink>
      <Separator />
      <CustomLink href={studentLoginRoute}>Student</CustomLink>
    </div>
  );
}
