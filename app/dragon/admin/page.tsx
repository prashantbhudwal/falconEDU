import React from "react";
import { Card, Text, Metric, Flex, ProgressBar } from "@tremor/react";
import AdminNavbar from "./components/admin-navbar";
import TaskChart from "./components/task-chart";
import { getAllPublishedTasksByDate } from "./queries";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { FaChalkboardTeacher } from "react-icons/fa";
import Link from "next/link";

const AdminPage = async () => {
  const allTasks = await getAllPublishedTasksByDate();

  return (
    <>
      <AdminNavbar title="Task" />
      <TaskChart chartData={allTasks?.dayWiseChartData} />
      <div className="w-11/12 mx-auto grid grid-cols-2 gap-4 items-end mb-10">
        {Array.from(allTasks?.dayWiseData || []).map(([key, value]) => {
          return (
            <Card
              key={key}
              className="mx-auto mt-5 rounded-xl flex gap-2 items-center"
              decoration="top"
              decorationColor="indigo"
            >
              <Text># Published {key}</Text>
              <Metric>{value}</Metric>
            </Card>
          );
        })}
        <div className="flex gap-2 flex-col">
          <Link
            href="/dragon/admin/teachers"
            className="flex gap-2 items-center px-3 h-fit py-2 rounded-xl bg-secondary font-medium text-secondary-content"
          >
            Teachers <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link
            // href="/dragon/admin/students"
            href=""
            className="flex gap-2 items-center px-3 h-fit py-2 opacity-50 font-medium rounded-xl bg-primary text-primary-content"
          >
            Students <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
