import BackBar from "@/components/back-bar";
import { studentHomeURL } from "@/lib/urls";
export default async function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col h-full w-full">
        <BackBar link={studentHomeURL} noText />
        <div className="w-full overflow-y-auto custom-scrollbar bg-base-200">
          <div className="w-full bg-base-300 shadow-sm shadow-base-100 pb-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
