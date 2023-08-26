import { getAgents } from "../actions";
import AgentCard from "../components/AgentCard";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const agents = await getAgents(id);
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} data={agent} />
      ))}
    </div>
  );
}
