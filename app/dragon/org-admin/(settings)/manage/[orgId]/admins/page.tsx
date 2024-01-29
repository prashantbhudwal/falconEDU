import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { AddOrgAdminForm } from "@/app/dragon/org-admin/_components/add-user-form";
import { UserManagementCard } from "@/app/dragon/org-admin/_components/user-card";
import { db } from "@/lib/routers";
import { getServerSession } from "next-auth";
export default async function ManageAdmins({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  const admins = await db.org.getOrgAdminsInOrg({ userId });
  const adminsMinusSelf = admins?.filter((admin) => admin.userId !== userId);

  return (
    <>
      <div className="mx-auto my-2 flex w-11/12 flex-col space-y-6">
        <div className="self-center font-bold text-accent"> Manage Admins</div>
        <AddOrgAdminForm orgId={orgId} />
        {adminsMinusSelf?.length === 0 && (
          <div className="text-center text-gray-500">
            You are the only admin. No other admins in this organization
          </div>
        )}
        {adminsMinusSelf?.map((admin) => (
          <UserManagementCard
            key={admin.id}
            name={admin.User.name ?? ""}
            email={admin.User.email ?? ""}
            image={admin.User.image}
            userId={admin.userId}
            removeUserFunction={db.org.removeOrgAdminFromOrg}
          />
        ))}
      </div>
    </>
  );
}
