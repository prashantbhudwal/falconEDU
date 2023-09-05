import { Paper } from "@/components/ui/Paper";
import { SidebarNav } from "../../components/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getAgent } from "@/app/dragon/create/actions";
import { sidebarNavItems } from "@/app/dragon/create/config";

const getLinksFromParams = (params: { id: string }) => {
  return sidebarNavItems.map((item) => ({
    ...item,
    href: item.href.replace("[id]", params.id),
  }));
};

export default async function AgentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user || !session?.user?.id) {
    redirect(`/`);
  }

  const agent = await getAgent(params.id, session.user.id);

  console.log(agent);

  if (!agent) {
    notFound();
  }
  // Commented for testing
  // if (agent?.userId !== session?.user?.id) {
  //   notFound();
  // }

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full h-full">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={getLinksFromParams(params)} />
        </aside>
        <Paper className="flex-1 h-full">{children}</Paper>
      </div>
    </div>
  );
}
