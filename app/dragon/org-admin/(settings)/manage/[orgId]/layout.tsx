import { orgAdminOrgSettingsURL } from "@/lib/urls";
import BackBar from "@/components/back-bar";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col bg-base-300">
      <div className="flex h-full w-full flex-col">
        <BackBar link={orgAdminOrgSettingsURL} />
        <div className="custom-scrollbar w-full overflow-y-auto bg-base-300">
          <div className="min-h-screen w-full bg-base-300 pb-10 shadow-sm shadow-base-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
