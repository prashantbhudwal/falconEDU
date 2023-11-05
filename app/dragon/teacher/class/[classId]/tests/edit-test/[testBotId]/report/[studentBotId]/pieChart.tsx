"use client";
import { PieChart } from "react-minimal-pie-chart";
import { ReportType } from "./page";

export default function PieChartComponent({
  report,
}: {
  report: ReportType[];
}) {
  const correctAnswers = report.filter((question) => question.isCorrect).length;
  const incorrectAnswers = report.length - correctAnswers;
  const totalQuestions = report.length;

  const chartData = [
    {
      title: `Correct answers ${(
        (correctAnswers / totalQuestions) *
        100
      ).toFixed(1)}%`,
      value: correctAnswers,
      color: "#21C55D",
    },
    {
      title: `Incorrect answers ${(
        (incorrectAnswers / totalQuestions) *
        100
      ).toFixed(1)}%`,
      value: incorrectAnswers,
      color: "#EF4444",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-10">
      <div>
        <p className="whitespace-nowrap">Total Questions : {totalQuestions}</p>
        <p className="whitespace-nowrap pt-5 flex items-center gap-2">
          <span className="p-2 bg-green-500"></span>Correct answers :
          {correctAnswers}
        </p>
        <p className="whitespace-nowrap pt-5 flex items-center gap-2">
          <span className="p-2 bg-red-500"></span>
          Incorrect answers : {incorrectAnswers}
        </p>
      </div>
      <PieChart
        animate
        animationDuration={500}
        data={chartData}
        lengthAngle={360}
        lineWidth={30}
        paddingAngle={5}
        radius={50}
        startAngle={20}
      />
    </div>
  );
}
