"use client";
import React, { useMemo, useState } from "react";
import { Chrono } from "react-chrono";
import { TeacherTask } from "../queries";
import { formatDateWithTimeZone, tailwindColorToHex } from "@/lib/utils";
import { getTaskIcon } from "../../teacher/utils";
import { Flex, Select, SelectItem, Title } from "@tremor/react";
import { v4 as uuid } from "uuid";

const Timeline = ({ teacher }: { teacher: TeacherTask }) => {
  const [teacherTasks, setTeacherTasks] = useState(teacher?.tasks || []);
  const [selectedClassId, setSelectedClassId] = useState("");

  const items = useMemo(() => {
    return teacherTasks.map((task) => ({
      title: formatDateWithTimeZone({
        createdAt: task.createdAt,
        dateFormat: "dd MMM",
      }),
      cardTitle: task.name,
      cardSubtitle: task.type.toUpperCase(),
    }));
  }, [teacherTasks]);

  const setSelectedTask = (classId: string) => {
    if (!classId) {
      setSelectedClassId(classId);
      setTeacherTasks(teacher?.tasks || []);
      return;
    }
    setSelectedClassId(classId);
    const task = teacher?.tasks.filter((task) => task.classId === classId);

    if (task) {
      setTeacherTasks(task);
    }
  };

  return (
    <>
      <div className="w-11/12 mx-auto my-5">
        <Flex className="gap-3 flex-wrap">
          <Title>Historical Timeline</Title>
          <Select
            value={selectedClassId}
            className="w-fit justify-self-end"
            onValueChange={setSelectedTask}
            placeholder="Select Class"
          >
            {teacher?.classes.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name || classItem.grade}
              </SelectItem>
            ))}
          </Select>
        </Flex>
      </div>
      <Chrono
        items={items}
        hideControls
        allowDynamicUpdate
        enableBreakPoint
        verticalBreakPoint={500}
        activeItemIndex={0}
        mode="VERTICAL_ALTERNATING"
        theme={{
          primary: tailwindColorToHex("text-gray-700"),
          secondary: tailwindColorToHex("text-blue-300"),
          cardBgColor: "transparent",
          cardTitleColor: "white",
          cardSubtitleColor: tailwindColorToHex("text-gray-400"),
          titleColor: tailwindColorToHex("text-slate-400"),
        }}
        fontSizes={{
          cardSubtitle: "12px",
          cardText: "10px",
          cardTitle: "15px",
          title: "10px",
        }}
        cardHeight={"fit-content"}
        cardWidth={"fit-content"}
      />
      {teacherTasks.length === 0 && (
        <Flex className="w-full items-center justify-center">
          <Title className="mt-5 mb-2">No Tasks Yet</Title>
        </Flex>
      )}
    </>
  );
};

export default Timeline;
