import { ComingSoon } from "@/app/dragon/org-admin/_components/coming-soon";
export default async function ManageAdmins({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  return (
    <div className="flex flex-col space-y-4 p-2">
      <ComingSoon />
    </div>
  );
}
