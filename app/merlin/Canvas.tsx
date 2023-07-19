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

export default function Canvas({ className }: { className?: string }) {
  const router = useRouter();
  const [fetchNow, setFetchNow] = useState(false);
  const [ideaStream, setIdeaStream] = useState<string[]>([]);
  const [blockType, setBlockType] = useState<ideaType>("");
  const [streamCompleted, setStreamCompleted] = useState<boolean>(true);
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [lessonIdeas, setLessonIdeas] = useAtom(lessonIdeasAtom);

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
    setIdeaStream([]);
    setBlockType(item.text.toLowerCase());
    setStreamCompleted(false);
    setFetchNow(true);
  };

  useEffect(() => {
    if (topic === "" || subtopic === "") {
      router.push("/preferences");
    }
  }, [topic, subtopic]);

  const specObject = {
    accept: "Box",
    drop: (item: any) => startGeneration(item),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);

  const handleNewMessage = useCallback((chunk: string) => {
    setIdeaStream((prevChunk) => [...prevChunk, chunk]);
  }, []);

  const { isLoading, error } = useFalconStream(
    handleNewMessage,
    fetchNow,
    () => setFetchNow(false),
    () => setStreamCompleted(true),
    () => setCurrentBlockId(uuid()),
    blockType
  );

  useEffect(() => {
    if (
      streamCompleted === true &&
      ideaStream.length > 0 &&
      currentBlockId != lastBlockId
    ) {
      const randomId = uuid();
      const emoji = getEmoji(blockType);
      setLessonIdeas((prevIdeas) => [
        ...prevIdeas,
        {
          text: ideaStream,
          id: randomId,
          type: blockType,
          emoji: emoji,
        },
      ]);
      setLastBlockId(currentBlockId);
    }
  }, [streamCompleted]);

  return (
    <div
      ref={streamCompleted ? drop : null}
      role={"Board"}
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${
        isOver ? "shadow-inner bg-emerald-900" : "shadow-md bg-slate-900"
      }`}
    >
      <header className="font-medium text-emerald-500 border-b border-solid border-emerald-700 pb-2 flex flex-row justify-between w-full items-center">
        <div className="text-left text-emerald-600 text-xs">
          {`Grade ${grade}`}
          <p className="text-xs w-10">{subject}</p>
        </div>
        <div className="text-center max-w-xl">
          <h1 className="text-lg">{subtopic}</h1>
          <p className=" text-base  text-slate-600">{topic}</p>
        </div>
        <div className="text-xs text-left text-emerald-600">{board}</div>
      </header>
      {!blockType && lessonIdeas.length === 0 && (
        <div className="text-emerald-900 text-center text-4xl pt-24">
          <p>Drop a Lesson Block Here</p>
        </div>
      )}
      {streamCompleted === false && (
        <LiveBlock
          text={ideaStream}
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
