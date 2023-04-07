"use client";
import Canvas from "./Canvas";
import Chip from "./Chip";
import Sidebar from "./Sidebar";
import OutlineBlock from "./OutlineBlock";
import { buttonsArray as promptsArray } from "../schema";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useAppState } from "../context/app-context";
import useDesktop from "@/hooks/useDesktop";
import DesktopOnly from "@/components/DesktopOnly";
import { getEmoji } from "../utils";

export default function Merlin() {
  const isDesktop = useDesktop();
  const {
    topic: chatTopic,
    subtopic: chatSubtopic,
    grade: chatGrade,
    currentLesson,
  } = useAppState();

  if (!isDesktop) {
    return <DesktopOnly />;
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full">
        <Sidebar
          className="col-start-1 col-span-2 row-start-1"
          heading={"Lesson Blocks"}
        >
          {promptsArray.map((buttonText: string) => (
            <Chip key={buttonText} text={buttonText} />
          ))}
        </Sidebar>
        <Canvas className="col-start-3 col-span-8 h-screen overflow-y-auto custom-scrollbar" />
        <Sidebar className="col-start-11 col-span-2" heading={"Outline"}>
          {currentLesson &&
            currentLesson
              .slice()
              .reverse()
              .map((block, index) => (
                <OutlineBlock key={block.id}>{`${getEmoji(
                  block.type
                )} ${" "}   ${block.type}`}</OutlineBlock>
              ))}
        </Sidebar>
      </div>
    </DndProvider>
  );
}
