"use client";
import { useState } from "react";
import grades from "../data/grades.json";
import { useAppState } from "../context/app-context";
import Select from "@/components/Select";

export default function Home() {
  const { topic, subtopic, grade, setTopic, setSubtopic, setGrade } =
    useAppState();
  const [started, setStarted] = useState(false);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value);
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopic(e.target.value);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubtopic(e.target.value);
  };

  const handleClick = () => {
    setStarted(true);
  };

  const gradeOptions = grades.map((g) => ({
    id: g.id,
    name: `Grade ${g.grade}`,
  }));
  const chapterOptions =
    grades
      .find((g) => g.grade.toString() === grade)
      ?.chapters.map((c) => ({ id: c.id, name: c.name })) || [];
  const topicOptions =
    grades
      .find((g) => g.grade.toString() === grade)
      ?.chapters.find((c) => c.name === topic)
      ?.topics.map((t) => ({ id: t.id, name: t.name })) || [];

  return (
    <div className="flex flex-col gap-4 items-center m-4">
      <Select
        options={gradeOptions}
        value={grade}
        onChange={handleGradeChange}
        label="a grade"
      />
      <Select
        options={chapterOptions}
        value={topic}
        onChange={handleChapterChange}
        label="a chapter"
      />
      <Select
        options={topicOptions}
        value={subtopic}
        onChange={handleTopicChange}
        label="a topic"
      />
      <button
        className="bg-fuchsia-500 ring-1 ring-slate-700 text-slate-800 rounded-md px-8 py-2 text-lg font-medium capitalize"
        onClick={handleClick}
        disabled={!topic || !subtopic || !grade}
      >
        Save
      </button>
    </div>
  );
}
