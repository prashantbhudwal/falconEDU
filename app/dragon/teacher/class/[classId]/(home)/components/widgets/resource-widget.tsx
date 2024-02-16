import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddIcon } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/routers";
import { WidgetFallback } from "./widget-fallback";
import { Suspense } from "react";
import { Source } from "@prisma/client";
import { formatDate } from "@/lib/utils";
export async function UploadWidget({ classId }: { classId: string }) {
  const resources = await db.source.queries.allByClassId({ classId });
  const hasResources = resources.length > 0;

  return (
    <Suspense fallback={<WidgetFallback />}>
      <Card className="custom-scrollbar h-[400px] overflow-y-clip hover:overflow-y-auto">
        <CardHeader className="sticky top-0 bg-base-200">
          <div className="flex items-center justify-between">
            <CardTitle>Resources</CardTitle>
            <Link href={""}>
              <Button size={"icon"} variant={"ghost"}>
                <AddIcon size="sm" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {hasResources ? (
            <ResourceList resources={resources} />
          ) : (
            <NoResources />
          )}
        </CardContent>
      </Card>
    </Suspense>
  );
}

const ResourceList = ({ resources }: { resources: Source[] }) => {
  return (
    <div className=" flex flex-col space-y-4">
      {resources.map((resource) => (
        <Link href={""} key={resource.id}>
          <Card className="flex items-center justify-between">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{resource.title}</CardTitle>
              <CardDescription className="text-xs">
                Last used:
                {formatDate(resource.updatedAt, {
                  withTime: true,
                })}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};

const NoResources = () => {
  return (
    <div className="text-center text-sm">
      No Resources Found.
      <br />
      <Link href={""} className="text-info underline">
        Add Resource
      </Link>
    </div>
  );
};
