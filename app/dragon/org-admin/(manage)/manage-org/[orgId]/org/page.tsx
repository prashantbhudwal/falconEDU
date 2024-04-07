import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UpdateOrgForm } from "../../../../components/org-form";
import { getServerSession } from "next-auth";
import { db } from "@/lib/routers";
import { OrgFormValues } from "../../../../components/org-form";

export default async function ManageOrg({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const orgData = await db.org.getOrgDataByOrgId({
    orgId,
  });
  if (!orgData) return <div>Something went wrong</div>;

  const board = orgData.board[0].name;

  const initialValues: OrgFormValues = {
    name: orgData.name,
    type: orgData.type,
    boardNames: board,
    state: orgData.state,
    language_medium: orgData.language_medium,
    language_native: orgData.language_native || "",
    brandName: orgData.brandName,
    city: orgData.city || "",
  };

  return (
    <div className="flex flex-col space-y-4 p-2">
      <UpdateOrgForm initialValues={initialValues} orgId={orgId} />
    </div>
  );
}
