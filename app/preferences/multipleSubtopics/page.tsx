"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import CheckboxGrid from "../CheckboxGrid";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { startedAtom } from "@/app/atoms/app";
import { lessonIdeasAtom } from "@/app/atoms/lesson";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/app/atoms/preferences";
import Button from "@/app/components/Button";
import TextInput from "../TextInput";
import { worksheetSubtopicsAtom } from "@/app/atoms/worksheet";

export default function Page() {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [topic] = useAtom(topicAtom);
  const [allContent, setAllContent] = useState([""]);
  const [inputValue, setInputValue] = useState("");
  const [_, setStarted] = useAtom(startedAtom);
  const [__, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const router = useRouter();
  const { content, startStreaming } = usePrediction(topic, "predictSubtopics");
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [grade] = useAtom(gradeAtom);
  const [worksheetSubtopics, setWorksheetSubtopics] = useAtom(
    worksheetSubtopicsAtom
  );

  useEffect(() => {
    if (board === "" || subject === "" || grade === "") {
      router.push("/preferences");
    }
  }, [board, subject, grade, router]);

  const handleStart = () => {
    router.push("/merlin");
    setStarted(true);
    setLessonIdeas([]);
  };

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleAddSubtopic = () => {
    if (inputValue) {
      setWorksheetSubtopics([...worksheetSubtopics, inputValue]);
      setInputValue("");
    }
  };

  useEffect(() => {
    setWorksheetSubtopics([]);
    startStreaming();
  }, []);

  useEffect(() => {
    if (contentStreamCompleted) {
      setAllContent(content);
    }
  }, [contentStreamCompleted]);

  return (
    <div className="flex flex-col gap-10 items-center m-4">
      <div className="flex gap-3">
        <TextInput
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter any topic..."
        />

        <Button onClick={handleAddSubtopic} disabled={!inputValue}>
          Add Subtopic
        </Button>

        <Button
          onClick={handleStart}
          disabled={worksheetSubtopics.length === 0}
        >
          New Lesson
        </Button>
      </div>
      {/* {worksheetSubtopics.length > 0 && ( */}
        <div className="flex flex-row flex-wrap gap-2 mt-4 p-6 rounded-lg ring-2 ring-emerald-500 w-3/5">
          {worksheetSubtopics.map((subtopic, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-800"
            >
              {subtopic}
            </div>
          ))}
        </div>
      {/* )} */}

      {!contentStreamCompleted ? (
        <div className="flex flex-col items-center justify-center gap-2 h-12">
          <PropagateLoader color="#10B981" />
        </div>
      ) : (
        contentStreamCompleted &&
        allContent && (
          <CheckboxGrid
            content={allContent}
            selectedOptions={worksheetSubtopics}
            handleChange={(event) => {
              const selectedOption = event.target.value;
              if (event.target.checked) {
                setWorksheetSubtopics([...worksheetSubtopics, selectedOption]);
              } else {
                setWorksheetSubtopics(
                  worksheetSubtopics.filter(
                    (option) => option !== selectedOption
                  )
                );
              }
            }}
          />
        )
      )}
    </div>
  );
}
