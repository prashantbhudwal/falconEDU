"use client";

import React, { createContext, useContext, useState } from "react";

interface AppState {
  grade: string;
  topic: string;
  subtopic: string;
  setGrade: React.Dispatch<React.SetStateAction<string>>;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setSubtopic: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppState>({
  grade: "",
  topic: "",
  subtopic: "",
  setGrade: () => {},
  setTopic: () => {},
  setSubtopic: () => {},
});

export const useAppState = () => useContext(AppContext);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [grade, setGrade] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [subtopic, setSubtopic] = useState<string>("");

  return (
    <AppContext.Provider
      value={{
        grade,
        topic,
        subtopic,
        setGrade,
        setTopic,
        setSubtopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
