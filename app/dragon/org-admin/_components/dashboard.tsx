import React from "react";
import { Card, Text, Metric, Flex, Grid, Title } from "@tremor/react";
import TaskChart from "./task-chart";
import Link from "next/link";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { db } from "@/lib/routers";

export const Dashboard = async () => {
  const allTasks = await db.admin.task.getAllPublishedTasksByDate();
  const teachers = await db.admin.org.getAllTeachersInAnOrg();
  const sortedTeachers = Array.from(teachers?.teacherWeeklyData || []).sort(
    (a, b) => b[1].thisWeek - a[1].thisWeek,
  );

  return (
    <>
      <TaskChart chartData={allTasks?.dayWiseChartData} />
      <div className="mx-auto w-11/12">
        <Grid numItemsMd={2} className="mt-5 gap-6">
          {Array.from(allTasks?.dayWiseData || []).map(([key, value]) => {
            return (
              <Card key={key} className="rounded-xl">
                <Flex>
                  <Text># Published {key}</Text>
                  <Metric>{value}</Metric>
                </Flex>
              </Card>
            );
          })}
        </Grid>
        <Title className="mb-2 mt-5">Teachers</Title>
        {sortedTeachers.map(([key, value]) => (
          <Card key={key} className="mb-5 rounded-xl">
            <Link href={`/dragon/org-admin/teacher/${key}`}>
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
    </>
  );
};

