import { Card, Text, Metric, Flex, Title } from "@tremor/react";
import Link from "next/link";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
export default async function ExplorePage() {
  const teachers = await db.admin.org.getAllTeachersInAnOrg();
  const sortedTeachers = Array.from(teachers?.teacherWeeklyData || []).sort(
    (a, b) => b[1].thisWeek - a[1].thisWeek,
  );
  return (
    <div>
      <Title className="mb-2 mt-5">All Teachers</Title>
      {sortedTeachers.map(([key, value]) => (
        <Card key={key} className="mb-5 rounded-xl">
          <Link href={url.orgAdmin.explore.teacher(key ?? "")}>
            <Flex>
              <Text>{value.name}</Text>
              <div>
                <Flex className="gap-1">
                  <Metric>{value.prevWeek}</Metric>
                  {value.prevWeek > value.thisWeek ? (
                    <FaArrowDown className="text-error" />
                  ) : (
                    <FaArrowUp className="text-primary" />
                  )}
                  <Metric>{value.thisWeek}</Metric>
                </Flex>
              </div>
            </Flex>
          </Link>
        </Card>
      ))}
    </div>
  );
}
