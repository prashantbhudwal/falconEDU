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
  board: string;
  subject: string; // Add the subject to the AppState interface
  topic: string;
  subtopic: string;
  currentLesson: BlockContent[];
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setGrade: React.Dispatch<React.SetStateAction<string>>;
  setBoard: React.Dispatch<React.SetStateAction<string>>;
  setSubject: React.Dispatch<React.SetStateAction<string>>; // Add the setSubject to the AppState interface
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setSubtopic: React.Dispatch<React.SetStateAction<string>>;
  setCurrentLesson: React.Dispatch<React.SetStateAction<BlockContent[]>>;
}

const AppContext = createContext<AppState>({
  started: false,
  grade: "",
  board: "",
  subject: "", // Add the subject to the AppContext initial state
  topic: "",
  subtopic: "",
  currentLesson: [],
  setStarted: () => {},
  setGrade: () => {},
  setBoard: () => {},
  setSubject: () => {}, // Add the setSubject to the AppContext initial state
  setTopic: () => {},
  setSubtopic: () => {},
  setCurrentLesson: () => {},
});

export const useAppState = () => useContext(AppContext);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [grade, setGrade] = useState<string>("");
  const [board, setBoard] = useState<string>("");
  const [subject, setSubject] = useState<string>(""); // Create the subject state
  const [topic, setTopic] = useState<string>("");
  const [subtopic, setSubtopic] = useState<string>("");
  const [currentLesson, setCurrentLesson] = useState<BlockContent[]>([]);
  const [started, setStarted] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        started,
        grade,
        board,
        subject, // Add the subject to the AppContext.Provider value
        topic,
        subtopic,
        currentLesson,
        setStarted,
        setGrade,
        setBoard,
        setSubject, // Add the setSubject to the AppContext.Provider value
        setTopic,
        setSubtopic,
        setCurrentLesson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
