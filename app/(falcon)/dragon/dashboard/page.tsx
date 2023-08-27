import { getAgents } from "../actions";
import AgentPreview from "../components/AgentPreview";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const agents = await getAgents(id);
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-wrap gap-4 w-11/12">
        {agents.map((agent) => (
          <AgentPreview key={agent.id} data={agent} />
        ))}
      </div>
    </div>
  );
}
