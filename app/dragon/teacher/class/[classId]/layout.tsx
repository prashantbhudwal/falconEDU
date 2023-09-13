import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassNav } from "./components/class-navbar";

export default function DragonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  return (
    <div defaultValue="bots" className="w-11/12 mx-auto mt-8">
      <ClassNav classId={classId} />
      <div className="mt-4">{children}</div>
    </div>
  );
}
