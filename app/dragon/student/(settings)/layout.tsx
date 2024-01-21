import BackBar from "@/components/back-bar";
import { studentHomeURL } from "@/lib/urls";
export default async function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex h-full w-full flex-col">
        <BackBar link={studentHomeURL} noText />
        <div className="custom-scrollbar w-full overflow-y-auto bg-base-200">
          <div className="w-full bg-base-300 pb-10 shadow-sm shadow-base-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
