import Paper from "@ui/Paper";
type AgentProps = {
  data?: {};
  id?: string;
};

export default function Agent({ id, data }: AgentProps) {
  return (
    <div className="flex flex-col first-line:h-full">
      <Paper />
      <h1>Agent One</h1>
    </div>
  );
}
