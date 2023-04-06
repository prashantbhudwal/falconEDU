"use client";

import React, { createContext, useContext, useState } from "react";
interface BlockContent {
  text: string | string[];
  id: string;
  type: string;
  emoji: string;
}
interface AppState {
  started: boolean;
  grade: string;
  topic: string;
  subtopic: string;
  currentLesson: BlockContent[];
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setGrade: React.Dispatch<React.SetStateAction<string>>;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setSubtopic: React.Dispatch<React.SetStateAction<string>>;
  setCurrentLesson: React.Dispatch<React.SetStateAction<BlockContent[]>>;
}

const AppContext = createContext<AppState>({
  started: false,
  grade: "",
  topic: "",
  subtopic: "",
  currentLesson: [],
  setStarted: () => {},
  setGrade: () => {},
  setTopic: () => {},
  setSubtopic: () => {},
  setCurrentLesson: () => {},
});

export const useAppState = () => useContext(AppContext);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [grade, setGrade] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [subtopic, setSubtopic] = useState<string>("");
  const [currentLesson, setCurrentLesson] = useState<BlockContent[]>([]);
  const [started, setStarted] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        started,
        grade,
        topic,
        subtopic,
        currentLesson,
        setStarted,
        setGrade,
        setTopic,
        setSubtopic,
        setCurrentLesson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
