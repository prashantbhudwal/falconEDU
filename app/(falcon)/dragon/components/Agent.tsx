import { Paper } from "@/components/ui/paper";
import { Button } from "@ui/button";
import { TextareaAutosize } from "@ui/textarea-autosize";
import AgentForm from "./agent-config";
type AgentProps = {
  data?: {};
  id?: string;
};

export default function Agent({ id, data }: AgentProps) {
  return (
    <Paper className="flex flex-col mx-auto h-full">
      <AgentForm />
      <TextareaAutosize />
      <h1>Agent One</h1>
      <Button>Click Me</Button>
    </Paper>
  );
}
