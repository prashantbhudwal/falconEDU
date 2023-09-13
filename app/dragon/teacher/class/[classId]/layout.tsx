import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassNav } from "./components/class-navbar";
import { Paper } from "@/components/ui/Paper";
import { Separator } from "@/components/ui/separator";

export default function DragonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  return (
    <div defaultValue="bots" className="w-11/12 mt-8">
      <div className="flex flex-row">
        <ClassNav classId={classId} className="w-48 flex flex-col gap-6" />
        <Paper className="min-h-screen w-5/6">{children}</Paper>
      </div>
    </div>
  );
}
