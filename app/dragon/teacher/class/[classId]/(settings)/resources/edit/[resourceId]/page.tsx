import { Paper } from "@/components/ui/paper";
import { db } from "@/lib/routers";
import { UploadCard } from "./upload-card";
import { Resource } from "./resource";

export default async function Resources({
  params,
}: {
  params: {
    classId: string;
    resourceId: string;
  };
}) {
  const resourceId = params.resourceId;
  const resource = await db.source.queries.byId({ id: resourceId });
  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <Paper variant={"readable"} className="h-full">
      <Resource resource={resource} />
    </Paper>
  );
}
