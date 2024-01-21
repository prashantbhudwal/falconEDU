"use client";
import { predictTopics } from "../../ai/predictor";
import { GridLoader } from "react-spinners";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import PredictionGrid from "../prediction-grid";
import { topicAtom, subtopicAtom } from "@/lib/atoms/preferences";
import { startedAtom } from "@/lib/atoms/app";
import { lessonIdeasAtom } from "@/lib/atoms/lesson";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/lib/atoms/preferences";
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [topic] = useAtom(topicAtom);
  const [topics, setTopics] = useState([""]);
  const [subtopic, setSubtopic] = useAtom(subtopicAtom);
  const [_, setStarted] = useAtom(startedAtom);
  const [__, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const router = useRouter();
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [grade] = useAtom(gradeAtom);

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
    setSubtopic(event.target.value);
  };

  useEffect(() => {
    setSubtopic("");
    setLoading(true);
    const predict = async (
      chapter: string,
      subject: string,
      board: string,
      grade: string,
    ) => {
      const content = await predictTopics({ chapter, subject, board, grade });
      setTopics(content);
    };
    predict(topic, subject, board, grade).then(() => setLoading(false));
  }, []);

  return (
    <div className="m-4 flex flex-col items-center gap-10">
      <div className="join">
        <input
          className="input join-item input-bordered w-96"
          value={subtopic}
          onChange={handleChange}
          placeholder="Enter any topic..."
        />

        <button
          onClick={handleStart}
          disabled={!subtopic || loading}
          className={`btn btn-primary join-item my-auto`}
        >
          New Lesson
        </button>
      </div>

      {loading ? (
        <div className="flex h-12 flex-col items-center justify-center gap-2">
          <GridLoader color="#10B981" />
        </div>
      ) : (
        <PredictionGrid
          content={topics}
          selectedOption={subtopic}
          handleChange={handleChange}
          className="bg-primary"
        />
      )}
    </div>
  );
}
