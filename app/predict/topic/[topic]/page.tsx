"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { shouldRegenerateAtom } from "@/app/atoms/lesson";
const TestString =
  "$$States of matter$$_$$Physical and chemical properties of matter$$_$$Density and buoyancy$$_$$Solids, liquids, gases and plasma$$_$$Changes in states of matter (melting, freezing, boiling)$$_$$Mixtures and solutions$$_$$Physical and chemical properties of matter$$_$$Density and buoyancy$$_$$Physical and chemical properties of matter$$_$$Density and buoyancy$$";

const getRadioButtons = function (
  topics: string,
  selectedTopic: string,
  handleTopicChange: (event: any) => void
) {
  const topicArray = topics
    .replace(/\$\$(?:(?!\$\$).)*\$\$/g, (match) => match.slice(2, -2))
    .split("_");

  const topicRadioButtons = topicArray.map((topic, index) => (
    <label
      key={index}
      htmlFor={`topic-${index}`}
      className={`p-3 w-96 border rounded cursor-pointer ${
        selectedTopic === topic
          ? "bg-emerald-500 text-slate-900"
          : "bg-slate-300 text-slate-900"
      }`}
    >
      <input
        type="radio"
        id={`topic-${index}`}
        name="topics"
        value={topic}
        checked={selectedTopic === topic}
        onChange={handleTopicChange}
        className="hidden" // This hides the default radio button
      />
      {topic}
    </label>
  ));

  const optionsGrid = (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl text-slate-400">Or just select one...</div>
      <div className="flex flex-row gap-2 flex-wrap w-4/5 justify-center">
        {topicRadioButtons}
      </div>
    </div>
  );
  return optionsGrid;
};

export default function Page({ params }: { params: { topic: string } }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const topic = decodeURIComponent(params.topic.replace(/%20/g, " "));
  const { content, startStreaming } = usePrediction(topic);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState("");

  const handleTopicChange = (event: any) => {
    setSelectedTopic(event.target.value);
  };

  useEffect(() => {
    startStreaming();
  }, []);

  useEffect(() => {
    if (contentStreamCompleted) {
      const concatenatedString = content.join("");
      setTopics(concatenatedString);
    }
  }, [contentStreamCompleted]);

  return (
    <div className="flex flex-col gap-6 items-center m-4">
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          id="inputText"
          value={selectedTopic}
          onChange={handleTopicChange}
          className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
          placeholder="Enter a topic"
        />
        <button
          className="bg-emerald-400 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize disabled:opacity-50"
          // onClick={}
          disabled={!selectedTopic}
        >
          Next
        </button>
      </div>

      {!contentStreamCompleted ? (
        <div className="flex flex-col items-center justify-center gap-2 h-12">
          <PropagateLoader color="#10B981" />
        </div>
      ) : (
        contentStreamCompleted &&
        topics &&
        getRadioButtons(topics, selectedTopic, handleTopicChange)
      )}
    </div>
  );
}
