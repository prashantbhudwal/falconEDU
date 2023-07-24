"use client";
import Canvas from "./Canvas";
import Sidebar from "../../../components/Sidebar";
import { buttonsArray as promptsArray } from "../../../utils";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { getEmoji } from "../../../utils";
import { useAtom } from "jotai";
import { lessonIdeasAtom, teachingAidsAtom } from "../../../atoms/lesson";
import Section from "../../../components/Section";
import DraggableChip from "../../../components/DraggableChip";
import { itemTypes } from "../../../config/itemTypes";
import { useRouter } from "next/navigation";

export default function Merlin() {
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const router = useRouter();

  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const handleLessonGeneration = () => {
    setTeachingAids([]);
    router.push("/magic/aid/lesson");
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full select-none">
        <Sidebar className="col-start-1 col-span-2 row-start-1 h-screen">
          <Section title="Lesson Blocks">
            {promptsArray.map((buttonText: string) => (
              <DraggableChip
                key={buttonText}
                type={itemTypes.BOX}
                color="primary"
              >
                {buttonText}
              </DraggableChip>
            ))}
          </Section>
        </Sidebar>
        <Canvas className="col-start-3 col-span-8 min-h-screen mt-2" />
        <Sidebar className="col-start-11 col-span-2 h-screen">
          <Section title="Outline" className="h-full">
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
          <button
            className="btn btn-primary btn-md mb-4"
            onClick={handleLessonGeneration}
            disabled={lessonIdeas.length == 0}
          >
            Generate
          </button>
        </Sidebar>
      </div>
    </DndProvider>
  );
}
