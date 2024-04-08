import { Metric } from "@tremor/react";
import Link from "next/link";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "@/components/icons";

export default async function ExplorePage() {
  const teachers = await db.admin.org.getAllTeachersInAnOrg();
  // TODO: Refactor this to use better naming and sorting
  const sortedTeachers = Array.from(teachers?.teacherWeeklyData || []).sort(
    (a, b) => b[1].thisWeek - a[1].thisWeek,
  );

  return (
    <div className="flex flex-col space-y-2">
      {sortedTeachers.map(([key, value]) => {
        const { name, prevWeek, thisWeek } = value;
        const hasIncreased = thisWeek > prevWeek;
        return (
          <Link href={url.orgAdmin.explore.teacher(key ?? "") || ""} key={key}>
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{name}</CardTitle>
                <div className="flex flex-row gap-1">
                  <Metric>{prevWeek}</Metric>
                  <div className="flex h-fit flex-row gap-[0.15rem] p-1 text-xs">
                    {hasIncreased ? (
                      <ArrowDownIcon size="3xs" color="destructive" />
                    ) : (
                      <ArrowUpIcon size="3xs" color="primary" />
                    )}
                    <div>{thisWeek}</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
