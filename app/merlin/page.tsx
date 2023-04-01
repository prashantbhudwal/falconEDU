"use client";
import Canvas from "./Canvas";
import Chip from "./Chip";
import Sidebar from "./Sidebar";
import OutlineBlock from "./OutlineBlock";
import { buttonsArray as promptsArray } from "../schema";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useAppState } from "../context/app-context";

export default function Merlin() {
  const {
    topic: chatTopic,
    subtopic: chatSubtopic,
    grade: chatGrade,
  } = useAppState();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full">
        <Sidebar
          className="col-start-1 col-span-2 row-start-1"
          heading={"Blocks"}
        >
          {promptsArray.map((buttonText: string) => (
            <Chip key={buttonText} text={buttonText} />
          ))}
        </Sidebar>
        <Canvas className="col-start-3 col-span-8 h-screen overflow-y-auto custom-scrollbar" />
        <Sidebar className="col-start-11 col-span-2" heading={"Outline"}>
          <OutlineBlock>
            1. This is the text <br /> 2. More text <br />
            1. This is the text <br /> 2. More text <br />
          </OutlineBlock>
        </Sidebar>
      </div>
    </DndProvider>
  );
}
