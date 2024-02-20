import { Toaster } from "@/components/ui/toaster";
import { getClassURL } from "@/lib/urls";
import BackBar from "@/components/back-bar";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex h-full w-full flex-col">
        <BackBar link={getClassURL(classId)} />
        <div className=" h-full w-full overflow-y-auto bg-base-200">
          <div className="h-full min-h-screen w-full bg-base-300 pb-10 shadow-sm shadow-base-100">
            {children}
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
}
