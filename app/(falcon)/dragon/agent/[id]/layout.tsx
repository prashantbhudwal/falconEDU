import { Paper } from "@/components/ui/paper";
import { SidebarNav } from "../../components/sidebar-nav";
import { Separator } from "@/components/ui/separator";

const getLinksFromParams = (params: { id: string }) => {
  const root = "/dragon/agent/[id]";
  const sidebarNavItems = [
    {
      title: "Basic Information",
      href: `${root}/basic-information`,
    },
    {
      title: "Persona",
      href: `${root}/persona`,
    },
    {
      title: "Student Information",
      href: `${root}/student-information`,
    },
    {
      title: "Language",
      href: `${root}/language`,
    },
  ];
  return sidebarNavItems.map((item) => ({
    ...item,
    href: item.href.replace("[id]", params.id),
  }));
};

export default function AgentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const { id } = params;

  return (
    <div className="space-y-6 p-6 pb-16 h-full w-full">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings - {id}</h2>
        <p className="text-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={getLinksFromParams(params)} />
        </aside>
        <Paper className="flex-1 lg:max-w-2xl h-full w-full">{children}</Paper>
      </div>
    </div>
  );
}
