import Link from "next/link";
import { AgentTestData } from "../agentTestData";
import Avvvatars from "avvvatars-react";

type AgentCardProps = {
  data: AgentTestData;
};
export default function AgentCard({ data }: AgentCardProps) {
  return (
    <Link href={`/agent/${data.id}`}>
      <div className="card card-compact w-64 bg-base-100 shadow-xl hover:bg-base-200 hover:shadow-2xl hover:scale-105 cursor-pointer">
        <figure className="py-6">
          <Avvvatars value={data.id} style="shape" size={100} />
        </figure>
        <div className="card-body">
          <h2 className="card-title justify-center">{data.name}</h2>
          <div className="card-actions justify-center">
            <div className="badge badge-accent">{data.curriculum}</div>
            {data.subjects.map((subject) => (
              <div className="badge badge-info" key={subject}>
                {subject}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
