"use client";
import { Card, LineChart, Title } from "@tremor/react";

export default function TaskChart({
  chartData,
}: {
  chartData: { day: string; ["Total Tasks"]: number }[] | undefined;
}) {
  return (
    <Card>
      <Title className="py-0 text-center">Daily Published Tasks</Title>
      <LineChart
        className="mt-6"
        data={chartData || []}
        index="day"
        categories={["Total Tasks"]}
        colors={["emerald", "gray"]}
        yAxisWidth={30}
      />
    </Card>
  );
}
