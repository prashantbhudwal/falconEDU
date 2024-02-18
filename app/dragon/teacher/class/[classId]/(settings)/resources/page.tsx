import { Paper } from "@/components/ui/paper";
import { db } from "@/lib/routers";

import { NewResourceDialog, NewResourceForm } from "./new-resource-form";

export default async function Resources({
  params,
}: {
  params: {
    classId: string;
  };
}) {
  const classId = params.classId;
  const allResources = await db.source.queries.allByClassId({ classId });

  return (
    <Paper className="items-center">
      <NewResourceDialog classId={classId} />
      <div>
        {allResources.map((resource) => (
          <div key={resource.id}>{resource.title}</div>
        ))}
      </div>
    </Paper>
  );
}
