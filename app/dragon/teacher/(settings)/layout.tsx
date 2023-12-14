import { getTeacherHomeURL } from "@/lib/urls";
import BackBar from "@/components/back-bar";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-base-300 w-full">
      <div className="flex flex-col h-full w-full">
        <BackBar link={getTeacherHomeURL()} />
        <div className="w-full overflow-y-auto custom-scrollbar bg-base-300">
          <div className="w-full bg-base-300 shadow-sm shadow-base-100 pb-10 min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
