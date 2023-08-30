import { Paper } from "@/components/ui/paper";
import AgentForm from "./agent-config-form";
type AgentProps = {
  data?: {};
  id?: string;
};

export default function Agent({ id, data }: AgentProps) {
  return (
    <Paper className="flex flex-col mx-auto h-full">
      <AgentForm />
    </Paper>
  );
}
