import { AdminNavbar } from "./_components/navbar";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { RegisterOrgForm } from "./_components/org-form";
import { Dashboard } from "./_components/dashboard";
import { getManageTeachersURL } from "@/lib/urls";
import { db } from "@/lib/routers";
import { Button } from "@/components/ui/button";
import { AddIcon } from "@/components/icons";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const org = await db.admin.org.getOrgByUserId(userId);
  const name = org?.name;
  const hasTeachers = org && org?.teacher?.length > 0;
  const orgId = org?.id || "";

  return (
    <div className="flex h-screen min-w-full flex-col">
      <AdminNavbar title={name && name?.length > 0 ? name : "Home"} />
      <div className="custom-scrollbar overflow-y-auto">
        {!org && <RegisterOrg userId={userId} />}
        {hasTeachers ? <Dashboard /> : <AddTeachers orgId={orgId} />}
      </div>
    </div>
  );
}

const RegisterOrg = ({ userId }: { userId: string }) => {
  return (
    <div className="flex min-w-full flex-col space-y-2 px-4 py-3">
      <div className="font-semibold text-accent"> Register your Org </div>
      <RegisterOrgForm userId={userId} />
    </div>
  );
};

const AddTeachers = ({ orgId }: { orgId: string }) => {
  return (
    <div className="flex h-full w-full flex-col place-content-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex flex-col items-center space-y-2 font-semibold">
          Start Tracking Progress
        </div>
        <Link href={getManageTeachersURL(orgId)}>
          <Button className="flex flex-row items-center space-x-3">
            <AddIcon size="xxs" />
            <div>Add teachers</div>
          </Button>
        </Link>
      </div>
    </div>
  );
};
