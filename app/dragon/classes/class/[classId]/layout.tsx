import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DragonLayout({
  children,
  bots,
  students,
  params,
}: {
  children: React.ReactNode;
  bots: React.ReactNode;
  students: React.ReactNode;
  params: { classId: string };
}) {
  return (
    <div className="flex min-w-full flex-col">
      <Navbar />
      <Tabs defaultValue="bots" className="w-11/12 mx-auto">
        <TabsList className="grid w-1/3 grid-cols-2 mx-auto my-6">
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="bots">{bots}</TabsContent>
          <TabsContent value="students">{students}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
