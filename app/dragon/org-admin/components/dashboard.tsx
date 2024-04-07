import { Card, Text, Metric, Flex, Grid } from "@tremor/react";
import TaskChart from "./task-chart";
import { db } from "@/lib/routers";

export const Dashboard = async () => {
  const allTasks = await db.admin.task.getAllPublishedTasksByDate();

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
      </div>
    </>
  );
};
