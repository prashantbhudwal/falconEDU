"use client";
import { predictChapters } from "../../ai/predictor";
import { GridLoader } from "react-spinners";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import PredictionGrid from "../prediction-grid";
import { topicAtom, subtopicAtom } from "@/lib/atoms/preferences";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/lib/atoms/preferences";
import { userFlowAtom } from "@/lib/atoms/app";
const API_URL = "/ai/predictor";
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [_, setSubtopic] = useAtom(subtopicAtom);
  const [subject] = useAtom(subjectAtom);
  const [chapters, setChapters] = useState([""]);
  const [topic, setTopic] = useAtom(topicAtom);
  const router = useRouter();
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [userFlow] = useAtom(userFlowAtom);
  const handleTopicChange = (event: any) => {
    setTopic(event.target.value);
  };

  //Todo Replace this with a custom hook
  useEffect(() => {
    if (board === "" || subject === "" || grade === "") {
      router.push("/preferences");
    }
  }, [board, subject, grade, router]);

  useEffect(() => {
    setTopic("");
    setSubtopic("");
    const predict = async (subject: string, board: string, grade: string) => {
      setLoading(true);
      //Create a post request to the api
      const chaptersJson = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          predictionType: "predictChapters",
          data: {
            subject,
            board,
            grade,
          },
        }),
      });
      const chapters = await chaptersJson.json();
      setChapters(chapters);
    };
    predict(subject, board, grade).then(() => setLoading(false));
  }, []);

  return (
    <div className="m-4 flex flex-col items-center gap-10">
      <div className="join">
        <input
          className="input join-item input-bordered w-96"
          value={topic}
          onChange={handleTopicChange}
          placeholder="Enter a chapter..."
        />
        <button
          onClick={() => router.push("/preferences/multipleSubtopics")}
          disabled={!topic || loading}
          className={`join-item my-auto ${
            userFlow === "worksheet" ? "btn btn-secondary" : "btn btn-primary"
          }`}
        >
          Next
        </button>
      </div>
      {loading ? (
        <div className="flex h-12 flex-col items-center justify-center gap-2">
          <GridLoader
            color={`${userFlow === "worksheet" ? "#D946EF" : "#10B981"}`}
          />
        </div>
      ) : (
        <PredictionGrid
          className={`${
            userFlow === "worksheet" ? "bg-secondary" : "bg-primary"
          }`}
          content={chapters}
          selectedOption={topic}
          handleChange={handleTopicChange}
        />
      )}
    </div>
  );
}
