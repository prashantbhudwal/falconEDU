"use client";
import { AreaChart, Card, LineChart, Title } from "@tremor/react";

export default function TaskChart({
  chartData,
}: {
  chartData: { day: string; ["Total Tasks"]: number }[] | undefined;
}) {
  return (
    <Card>
      <AreaChart
        className="mt-6"
        data={chartData || []}
        index="day"
        categories={["Total Tasks"]}
        showGradient={false}
        showAnimation
        animationDuration={1000}
        colors={["emerald"]}
        showTooltip={true}
        curveType="monotone"
        yAxisWidth={30}
      />
    </Card>
  );
}
