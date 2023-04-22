"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import PredictionGrid from "../PredictionGrid";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/app/atoms/preferences";
import TextInput from "../TextInput";
import Button from "../../components/Button";
export default function Page() {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [subject] = useAtom(subjectAtom);
  const [allContent, setAllContent] = useState([""]);
  const [topic, setTopic] = useAtom(topicAtom);
  const router = useRouter();
  const { content, startStreaming } = usePrediction(subject, "predictChapters");
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  if (board === "" || subject === "" || grade === "") {
    router.push("/preferences");
  }
  const handleTopicChange = (event: any) => {
    setTopic(event.target.value);
  };

  useEffect(() => {
    setTopic("");
    startStreaming();
  }, []);

  useEffect(() => {
    if (contentStreamCompleted) {
      setAllContent(content);
    }
  }, [contentStreamCompleted]);

  return (
    <div className="flex flex-col gap-6 items-center m-4">
      <div className="mt-4 flex gap-2">
        <TextInput
          value={topic}
          onChange={handleTopicChange}
          placeholder="Enter a chapter..."
        />
        <Button
          onClick={() => router.push("/preferences/subtopic")}
          disabled={!topic}
        >
          Next
        </Button>
      </div>

      {!contentStreamCompleted ? (
        <div className="flex flex-col items-center justify-center gap-2 h-12">
          <PropagateLoader color="#10B981" />
        </div>
      ) : (
        contentStreamCompleted &&
        allContent && (
          <PredictionGrid
            content={allContent}
            selectedOption={topic}
            handleChange={handleTopicChange}
          />
        )
      )}
    </div>
  );
}
