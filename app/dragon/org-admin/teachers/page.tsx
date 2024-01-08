import { Card, Flex, Metric, Text } from "@tremor/react";
import AdminNavbar from "../_components/admin-navbar";
import { getAllTeachersInAnOrg } from "../queries";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

export default async function TeachersPage() {
  const teachers = await getAllTeachersInAnOrg();
  const sortedTeachers = Array.from(teachers?.teacherWeekyData || []).sort(
    (a, b) => b[1].thisWeek - a[1].thisWeek
  );

  return (
    <>
      <AdminNavbar title="Teachers" />
      <div className="w-11/12 mx-auto mb-5">
        {sortedTeachers.map(([key, value]) => {
          return (
            <Card key={key} className="mt-5 rounded-xl">
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
            </Card>
          );
        })}
      </div>
    </>
  );
}
