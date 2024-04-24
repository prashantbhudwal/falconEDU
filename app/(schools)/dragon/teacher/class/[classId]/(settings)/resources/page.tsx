import { Paper } from "@/components/ui/paper";
import { db } from "@/lib/routers";

import { NewResourceDialog, NewResourceForm } from "./new-resource-form";
import { Source } from "@prisma/client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { url } from "@/lib/urls";

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
    <Paper className="h-full max-w-3xl items-center space-y-8">
      <NewResourceDialog classId={classId} />
      <div className="flex flex-col space-y-4">
        {allResources.map((resource) => (
          <ResourceCard
            resource={resource}
            classId={classId}
            key={resource.id}
          />
        ))}
      </div>
    </Paper>
  );
}

const ResourceCard = ({
  resource,
  classId,
}: {
  resource: Source;
  classId: string;
}) => {
  const { description, title, updatedAt } = resource;
  const nonNullableDescription =
    description && description.length > 0 ? description : "No description";
  const formattedUpdatedAt = formatDate(updatedAt, { withTime: true });
  const resourceRoute = url.teacher.editResource({
    resourceId: resource.id,
    classId: classId,
  });
  return (
    <Link href={resourceRoute} key={resource.id}>
      <Card className="cursor-pointer select-none ring-secondary transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:ring-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{nonNullableDescription}</CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex flex-row space-x-4 text-xs text-slate-400">
            <div>Last Updated: {formattedUpdatedAt}</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
