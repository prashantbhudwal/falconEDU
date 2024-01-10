import React from "react";
import {
  Card,
  Text,
  Metric,
  Flex,
  ProgressBar,
  Grid,
  Button,
  Title,
} from "@tremor/react";
import AdminNavbar from "./admin-navbar";
import TaskChart from "./task-chart";
import { getAllPublishedTasksByDate, getAllTeachersInAnOrg } from "../queries";
import Link from "next/link";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

const Dashboard = async () => {
  const allTasks = await getAllPublishedTasksByDate();
  const teachers = await getAllTeachersInAnOrg();
  const sortedTeachers = Array.from(teachers?.teacherWeekyData || []).sort(
    (a, b) => b[1].thisWeek - a[1].thisWeek
  );

  return (
    <>
      <TaskChart chartData={allTasks?.dayWiseChartData} />
      <div className="w-11/12 mx-auto">
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
        <Title className="mt-5 mb-2">Teachers</Title>
        {sortedTeachers.map(([key, value]) => {
          return (
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
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
