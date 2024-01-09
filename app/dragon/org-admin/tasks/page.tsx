import React from "react";
import {
  Card,
  Text,
  Metric,
  Flex,
  ProgressBar,
  Grid,
  Button,
} from "@tremor/react";
import AdminNavbar from "../_components/admin-navbar";
import TaskChart from "../_components/task-chart";
import { getAllPublishedTasksByDate } from "../queries";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { FaChalkboardTeacher } from "react-icons/fa";
import Link from "next/link";

const TasksPage = async () => {
  const allTasks = await getAllPublishedTasksByDate();

  return (
    <>
      <AdminNavbar title="Tasks" />
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
          <Flex justifyContent="center">
            <Button size="sm" className="rounded-xl my-5 w-fit">
              <Link href="/dragon/org-admin/teachers">
                <Flex>
                  Teachers <ArrowRightIcon className="w-4 h-4" />
                </Flex>
              </Link>
            </Button>
          </Flex>
        </Grid>
      </div>
    </>
  );
};

export default TasksPage;
