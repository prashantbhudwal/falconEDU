import Navbar from "@/components/navbar/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassNav } from "../../components/class-navbar";
import { Paper } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import ClassBreadcrumbs from "../../components/class-breadcrumbs";

export default function DragonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string };
}) {
  const { classId } = params;
  return <div>{children}</div>;
}
