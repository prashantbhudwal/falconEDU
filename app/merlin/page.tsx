"use client";
import Canvas from "./Canvas";
import Chip from "./components/Chip";
import Sidebar from "../components/Sidebar";
import { buttonsArray as promptsArray } from "../utils";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { getEmoji } from "../utils";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "../atoms/lesson";
import Section from "../components/Section";
import Chat from "./components/Chat";

export default function Merlin() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full select-none">
        <Sidebar className="col-start-1 col-span-2 row-start-1">
          <Section title="Lesson Blocks">
            {promptsArray.map((buttonText: string) => (
              <Chip key={buttonText} text={buttonText} />
            ))}
          </Section>
        </Sidebar>
        <Canvas className="col-start-3 col-span-8 min-h-screen" />
        <Sidebar className="col-start-11 col-span-2">
          <Section title="Outline">
            {lessonIdeas &&
              lessonIdeas
                .slice()
                .reverse()
                .map((block, index) => (
                  <div
                    className="text-base text-slate-400 leading-7 capitalize pl-4"
                    key={block.id}
                  >{`${getEmoji(block.type)} ${" "}   ${block.type}`}</div>
                ))}
          </Section>
        </Sidebar>
      </div>
      <Chat />
    </DndProvider>
  );
}
