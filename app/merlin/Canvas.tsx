"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "./components/CanvasBlock";
import useFalconStream from "@/app/merlin/hooks/useFalconStream";
import { getEmoji } from "../utils";
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
import { useChat, useCompletion } from "ai/react";
import Chat from "./components/Chat";
const ROUTE = "/api/blockChat";

export default function Canvas({ className }: { className?: string }) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
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

  const getSelectedBlockContent = (selectedBlockId: any) => {
    // Find the block with the selected id
    const selectedBlock = lessonIdeas.find(
      (block) => block.id === selectedBlockId
    );

    // string[].join("") if the selected block is a sting[] or else keep it as it is
    if (selectedBlock?.text instanceof Array) {
      return selectedBlock?.text.join("");
    }
    return selectedBlock?.text;
  };
  const {
    completion: messages,
    handleSubmit,
    input,
    handleInputChange,
    setInput,
  } = useCompletion({
    api: ROUTE,
    onFinish: () => {
      setInput("");
    },
    body: {
      content: getSelectedBlockContent(selectedBlockId),
    },
  });
  // console.log(messages);
  const handleBlockSelect = useCallback(
    (id: string) => {
      setSelectedBlockId(id);
    },
    [setSelectedBlockId]
  );

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
    if (
      contentStreamCompleted === true &&
      content.length > 0 &&
      currentStreamId !== lastBlockId
    ) {
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

  const updateLessonIdea = (
    selectedRadioButtonId: any,
    newIdeaContent: string | string[]
  ) => {
    setLessonIdeas((prevIdeas: BlockContent[]) => {
      // Find the index of the idea with the selected id
      const ideaIndex = prevIdeas.findIndex(
        (idea) => idea.id === selectedRadioButtonId
      );
      if (ideaIndex !== -1) {
        // If the idea is found, create a new array with the modified content
        const newIdeas = [...prevIdeas];
        newIdeas[ideaIndex] = {
          ...newIdeas[ideaIndex], // Keep all other properties the same
          text: newIdeaContent, // Update the 'text' property with new content
        };

        return newIdeas;
      }

      // If the idea isn't found, return the array unmodified
      return prevIdeas;
    });
  };

  useEffect(() => {
    updateLessonIdea(selectedBlockId, messages);
  }, [messages]);

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
          {messages}
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
              isSelected={block.id === selectedBlockId}
              onSelect={handleBlockSelect}
            />
          );
        })}
      <Chat
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
