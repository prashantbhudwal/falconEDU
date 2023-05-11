"use client";
import Sidebar from "./components/Sidebar";
import Section from "./components/Section";
import Canvas from "./components/Canvas";
import Chip from "./components/ChipDrag";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
export default function Raptor() {
  const questionTypes = [
    { value: "fillInTheBlanks", label: "Fill in the Blanks" },
    { value: "multipleChoice", label: "Multiple Choice" },
    { value: "trueFalse", label: "True/False" },
    { value: "shortAnswer", label: "Short Answer" },
    { value: "essay", label: "Essay" },
  ];

  const topics = [
    "Machine Learning",
    "Natural Language Processing And Other Stuff Because Long Text",
    "Computer Vision",
    "Robotics",
    "Artificial Neural Networks",
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full select-none">
        <Sidebar className="col-start-1 col-span-3 row-start-1">
          <Section title={"Topics"}>
            {topics.map((topic, index) => (
              <Chip key={index} color="secondary">
                {topic}
              </Chip>
            ))}
          </Section>
        </Sidebar>
        <Canvas
          className="col-start-4 col-span-7 min-h-screen"
          color="secondary"
          heading="Canvas"
          subheading="Drag and drop your ideas here"
          leftTop={<span className="text-sm">0/10</span>}
          rightTop={<span className="text-sm">0/10</span>}
        >
          hello I am Raptor
        </Canvas>
        <Sidebar className="col-start-11 col-span-2">
          <Section title={"Types"}>
            {questionTypes.map((questionType) => (
              <label key={questionType.value}>
                <input
                  type="checkbox"
                  name="questionType"
                  value={questionType.value}
                />{" "}
                {questionType.label}
              </label>
            ))}
          </Section>
        </Sidebar>
      </div>
    </DndProvider>
  );
}
