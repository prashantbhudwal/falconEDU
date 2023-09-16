import Navbar from "@/components/navbar";
import { Paper } from "@/components/ui/Paper";
import ClassBreadcrumbs from "./components/class-breadcrumbs";
export default function DragonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-full flex-col">
      <Navbar />
      <Paper className="min-h-screen w-9/12 mx-auto max-w-screen-xl flex flex-col space-y-4">
        <ClassBreadcrumbs />
        {children}
      </Paper>
    </div>
  );
}
