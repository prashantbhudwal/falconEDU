"use client";
import Canvas from "./Canvas";
import Sidebar from "../../../../components/Sidebar";
import { buttonsArray as promptsArray } from "../../../../lib";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { getEmoji } from "../../../../lib";
import { useAtom } from "jotai";
import { lessonIdeasAtom, teachingAidsAtom } from "../../../../atoms/lesson";
import Section from "../../../../components/Section";
import DraggableChip from "../../../../components/DraggableChip";
import { itemTypes } from "../../../../config/itemTypes";
import { useRouter } from "next/navigation";
import MerlinGrid from "../components/Grid";
import { worksheetSubtopicsAtom } from "@/atoms/worksheet";
import { subtopicAtom } from "@/atoms/preferences";
import useTrackPage from "@/hooks/analytics/useTrackPage";
export default function Merlin() {
  useTrackPage("Merlin");
  const [subtopic, setSubtopic] = useAtom(subtopicAtom);
  const [worksheetSubtopics] = useAtom(worksheetSubtopicsAtom);
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const router = useRouter();
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  if (subtopic === "" && worksheetSubtopics.length > 0)
    setSubtopic(worksheetSubtopics[0]);
  return (
    <DndProvider backend={HTML5Backend}>
      <MerlinGrid>
        <Sidebar className="col-span-2 col-start-1 row-start-1 ">
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
        <Canvas className="col-span-8 col-start-3 mt-1" />
        <Sidebar className="col-span-2 col-start-11 ">
          <Section title="Topics">
            <div className="flex flex-col gap-2">
              {worksheetSubtopics.length > 0 &&
                worksheetSubtopics.map((subTopic, index) => (
                  <label className="label text-sm" key={index}>
                    <span className={"label-text text-xs"}>{subTopic}</span>
                    <input
                      type="radio"
                      name="questionType"
                      value={subTopic}
                      checked={subtopic === subTopic}
                      onChange={() => setSubtopic(subTopic)}
                      className="radio-primary radio radio-sm p-1"
                    />
                  </label>
                ))}
            </div>
          </Section>
        </Sidebar>
      </MerlinGrid>
    </DndProvider>
  );
}

{
  /* {lessonIdeas &&
              lessonIdeas
                .slice()
                .reverse()
                .map((block, index) => (
                  <div
                    className="text-base text-slate-400 leading-7 capitalize pl-4"
                    key={block.id}
                  >{`${getEmoji(block.type)} ${" "}   ${block.type}`}</div>
                ))} */
}
