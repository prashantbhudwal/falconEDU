"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect } from "react";
import CanvasBlock from "./components/CanvasBlock";
import { getEmoji } from "@/utils";
import LiveBlock from "./components/LiveBlock";
import { useRouter } from "next/navigation";
import { BlockContent, ideaType, validateIdeaType } from "@/types";
import Header from "@/components/Header";
import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "@/atoms/preferences";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "@/atoms/lesson";
import { useCompletion } from "ai/react";
import Chat from "./components/Chat";
import { downloadBlock, getSelectedBlockContent } from "./utils";
const ROUTE = "/api/blockChat";
const MERLIN_ROUTE = "/api/falconStreamOnEdge";
import { v4 } from "uuid";

export default function Canvas({ className }: { className?: string }) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const router = useRouter();
  const [blockType, setBlockType] = useState<ideaType>("");
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [lessonIdeas, setLessonIdeas] = useAtom(lessonIdeasAtom);

  const {
    completion: messageNew,
    complete: handleBlockCompletion,
    isLoading: isBlockLoading,
  } = useCompletion({
    api: MERLIN_ROUTE,
    body: {
      board: board,
      topic: topic,
      subject: subject,
      subtopic: subtopic,
      grade: grade,
    },
    onFinish: (prompt, completion) => {
      // Type Guard
      const type = validateIdeaType(prompt);
      if (!type) return;
      const emoji = getEmoji(type);
      setLessonIdeas((prevIdeas) => [
        ...prevIdeas,
        {
          text: completion,
          id: v4(),
          type: type,
          emoji: emoji,
        },
      ]);
    },
  });

  const handleDrop = function (item: any, event: any) {
    // startGeneration(item);
    handleBlockCompletion(item);
    setBlockType(item);
  };
  // Redirect to preferences if topic or subtopic is not selected
  // useEffect(() => {
  //   if (topic === "" || subtopic === "") {
  //     router.push("/preferences");
  //   }
  // }, [topic, subtopic]);

  // React DnD
  const specObject = {
    accept: "Box",
    drop: (item: any, event: any) => handleDrop(item.text.toLowerCase(), event),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };
  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);
  // Utils
  const handleBlockSelect = (
    id: string,
    setSelectedBlockId: (id: string | null) => void
  ) => {
    setSelectedBlockId(id);
  };

  const removeBlock = (id: string) => {
    setLessonIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
  };

  const updateLessonIdea = (
    selectedRadioButtonId: any,
    newIdeaContent: string
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

  // Chat Stream
  const {
    completion: messages,
    handleSubmit,
    input,
    handleInputChange,
    setInput,
    isLoading,
  } = useCompletion({
    api: ROUTE,
    onFinish: () => {
      setInput("");
    },
    body: {
      content: getSelectedBlockContent(selectedBlockId, lessonIdeas),
    },
  });

  useEffect(() => {
    updateLessonIdea(selectedBlockId, messages);
  }, [messages]);

  return (
    <div
      ref={!isBlockLoading ? drop : null}
      role={"Board"}
      className={`${className} pb-96 marker:h-full flex flex-col items-center gap-4 text-slate-300 px-5 py-3 scroll-smooth overflow-y-scroll custom-scrollbar ${
        isOver ? "shadow-inner bg-emerald-900" : "shadow-md bg-slate-950"
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
      {isBlockLoading && (
        <LiveBlock
          text={messageNew}
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
              onDownload={() => downloadBlock(block.id, lessonIdeas, subtopic)}
              isSelected={block.id === selectedBlockId}
              onSelect={() => handleBlockSelect(block.id, setSelectedBlockId)}
            />
          );
        })}
      {blockType && lessonIdeas.length !== 0 && (
        <Chat
          input={input}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          selectedBlock={lessonIdeas.find(
            (idea) => idea.id === selectedBlockId
          )}
        />
      )}
    </div>
  );
}
