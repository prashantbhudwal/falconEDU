"use client";
import Canvas from "./Canvas";
import Chip from "./Chip";
import Sidebar from "./Sidebar";
import OutlineBlock from "./OutlineBlock";
import { buttonsArray as promptsArray } from "../utils";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import useDesktop from "@/app/hooks/useDesktop";
import DesktopOnly from "@/app/components/DesktopOnly";
import { getEmoji } from "../utils";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "../atoms/lesson";

export default function Merlin() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const isDesktop = useDesktop();
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
        <Canvas className="col-start-3 col-span-8 min-h-screen" />
        <Sidebar className="col-start-11 col-span-2" heading={"Outline"}>
          {lessonIdeas &&
            lessonIdeas
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
