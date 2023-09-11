import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DragonLayout({
  children,
  bots,
  students,
}: {
  children: React.ReactNode;
  bots: React.ReactNode;
  students: React.ReactNode;
}) {
  return (
    <div className="flex min-w-full flex-col">
      <Navbar />
      <Tabs defaultValue="bots" className="">
        <TabsList className="grid w-1/3 grid-cols-2 mx-auto mt-4">
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="bots">{bots}</TabsContent>
        <TabsContent value="students">{students}</TabsContent>
      </Tabs>
    </div>
  );
}
