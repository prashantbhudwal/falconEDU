"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Section from "./components/Section";
import Canvas from "./components/Canvas";
import ChipDrag from "./components/ChipDrag";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Checkbox from "./components/Checkbox";
import BloomBox from "./components/BloomBox";

export default function Raptor() {
  const questionTypes = [
    { value: "fillInTheBlanks", label: "Fill in the Blanks" },
    { value: "multipleChoiceSingleCorrect", label: "Multiple Choice" },
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
  const levels = [
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
    "Evaluate",
    "Create",
  ];
  const [checkedQuestionTypes, setCheckedQuestionTypes] = useState<string[]>(
    []
  );

  const handleCheckboxChange = (value: string) => {
    if (checkedQuestionTypes.includes(value)) {
      setCheckedQuestionTypes(
        checkedQuestionTypes.filter((val) => val !== value)
      );
    } else {
      setCheckedQuestionTypes([...checkedQuestionTypes, value]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full select-none">
        <Sidebar className="col-start-1 col-span-3 row-start-1">
          <Section title={"Topics"}>
            {topics.map((topic, index) => (
              <ChipDrag key={index} color="secondary">
                {topic}
              </ChipDrag>
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
          {checkedQuestionTypes.map((questionType) => (
            <Section title={questionType} key={questionType}>
              <div className="grid grid-cols-6 divide-x divide-slate-800 text-slate-600">
                {levels.map((level, index) => (
                  <BloomBox
                    key={index}
                    questionType={questionType}
                    bloomLevel={level}
                  >
                    {level}
                  </BloomBox>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="border-b-2 border-gray-700  p-2">
                  Questions will appear here
                </div>
                <div className="border-b-2 border-gray-700  p-2">
                  Questions will appear here
                </div>
              </div>
            </Section>
          ))}
        </Canvas>
        <Sidebar className="col-start-11 col-span-2">
          <Section title={"Types"}>
            {questionTypes.map((questionType) => (
              <Checkbox
                key={questionType.value}
                value={questionType.value}
                label={questionType.label}
                checked={checkedQuestionTypes.includes(questionType.value)}
                onChange={handleCheckboxChange}
              />
            ))}
          </Section>
        </Sidebar>
      </div>
    </DndProvider>
  );
}
