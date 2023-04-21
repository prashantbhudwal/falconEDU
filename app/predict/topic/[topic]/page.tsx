"use client";
import { usePrediction } from "@/app/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { shouldRegenerateAtom } from "@/app/atoms/lesson";

const getOptions = function (topics: string) {
  const topicArray = topics
    .replace(/\$\$(?:(?!\$\$).)*\$\$/g, (match) => match.slice(2, -2))
    .split("_");

  const topicOptions = topicArray.map((topic) => (
    <option key={topic} value={topic}>
      {topic}
    </option>
  ));

   
  return topicOptions;
};

export default function Page({ params }: { params: { topic: string } }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const topic = decodeURIComponent(params.topic.replace(/%20/g, " "));
  const { content, startStreaming } = usePrediction(topic);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState("");
  // console.log(content);

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  useEffect(() => {
    startStreaming();
  }, []);
  useEffect(() => {
    if (shouldRegenerate) {
      startStreaming();
    }
  }, [shouldRegenerate]);
  useEffect(() => {
    if (contentStreamCompleted) {
      const concatenatedString = content.join("");
      setTopics(concatenatedString);
    }
  }, [contentStreamCompleted]);

  return (
    <div
      className={`bg-slate-100 text-slate-900 px-8 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {/* {content} */}
        {!contentStreamCompleted && "Thinking"}
      </p>
      {contentStreamCompleted && (
        <select value={selectedTopic} onChange={handleTopicChange}>
          <option value="">Select a topic</option>
          {topics && getOptions(topics)}
        </select>
      )}

      {/* <button
        onClick={() => setShouldRegenerate(true)}
        className={`text-green-500`}
      >
        Regenerate
      </button> */}
    </div>
  );
}
