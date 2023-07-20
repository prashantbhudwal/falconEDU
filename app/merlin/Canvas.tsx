"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "./components/CanvasBlock";
import useFalconStream from "@/app/merlin/hooks/useFalconStream";
import { getEmoji } from "../utils";
import { v4 as uuid } from "uuid";
import LiveBlock from "./components/LiveBlock";
import { useRouter } from "next/navigation";
import { BlockContent } from "@/types";
import Header from "../components/Header";
import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "../atoms/preferences";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "../atoms/lesson";
import { ideaType } from "@/types";
import { generateDocx } from "../utils/generateDocx";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";

export default function Canvas({ className }: { className?: string }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const router = useRouter();
  const [blockType, setBlockType] = useState<ideaType>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [lessonIdeas, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const { startStreaming, content, currentStreamId, prevStreamId } =
    useFalconStream();

  const removeBlock = (id: string) => {
    setLessonIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
  };

  const downloadBlock = (id: string) => {
    const blockToDownload = lessonIdeas.filter((idea) => idea.id == id);
    const content = blockToDownload[0].text as string[];
    const payload = {
      topic: blockToDownload[0].type,
      subtopic,
      fetchedContent: content,
    };
    generateDocx(payload);
  };

  const startGeneration = function (item: any) {
    setBlockType(item);
    startStreaming(item);
  };

  useEffect(() => {
    if (topic === "" || subtopic === "") {
      router.push("/preferences");
    }
  }, [topic, subtopic]);

  const specObject = {
    accept: "Box",
    drop: (item: any) => startGeneration(item.text.toLowerCase()),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);

  useEffect(() => {
    console.log(currentStreamId, lastBlockId);

    if (
      contentStreamCompleted === true &&
      content.length > 0 &&
      currentStreamId !== lastBlockId
    ) {
      console.log("I ran Man");
      const randomId = uuid();
      const emoji = getEmoji(blockType);
      setLessonIdeas((prevIdeas) => [
        ...prevIdeas,
        {
          text: content,
          id: currentStreamId,
          type: blockType,
          emoji: emoji,
        },
      ]);
      setLastBlockId(currentStreamId);
    }
  }, [contentStreamCompleted]);

  return (
    <div
      ref={contentStreamCompleted ? drop : null}
      role={"Board"}
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${
        isOver ? "shadow-inner bg-emerald-900" : "shadow-md bg-slate-900"
      }`}
    >
      <Header
        leftTop={`Grade ${grade}`}
        leftBottom={subject}
        rightTop={board}
        heading={subtopic}
        subheading={topic}
        color="primary"
      />
      {!blockType && lessonIdeas.length === 0 && (
        <div className="text-emerald-900 text-center text-4xl pt-24">
          <p>Drop a Lesson Block Here</p>
        </div>
      )}
      {contentStreamCompleted === false && (
        <LiveBlock
          text={content}
          emoji={getEmoji(blockType)}
          type={blockType}
          key={"test"}
        />
      )}
      {lessonIdeas
        .slice()
        .reverse()
        .map((block: BlockContent) => {
          return (
            <CanvasBlock
              {...block}
              key={block.id}
              onRemove={removeBlock}
              onDownload={downloadBlock}
            />
          );
        })}
    </div>
  );
}
