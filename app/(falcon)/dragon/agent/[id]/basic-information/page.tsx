import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getAgent } from "../../../actions";
import AgentConfigForm from "../../../components/agent-config-form";

export interface AgentPageProps {
  params: {
    id: string;
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  console.log(params);
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
  return <AgentConfigForm />;
}
