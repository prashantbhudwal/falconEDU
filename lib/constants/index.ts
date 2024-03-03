import { FaRobot } from "react-icons/fa6";
import {
  HiClipboardDocumentCheck,
  HiAcademicCap,
  HiOutlineClipboard,
} from "react-icons/hi2";
export const taskPropertiesMap = {
  chat: {
    formattedType: "Bot",
    formattedTypeStudent: "Bot",
    Icon: FaRobot,
    iconColor: "text-primary",
    newName: "Untitled Bot",
    emptyChatMessage: "Start chatting with your teacher.",
    aiTemperature: 1,
  },
  test: {
    formattedType: "Test",
    formattedTypeStudent: "Test",
    Icon: HiClipboardDocumentCheck,
    iconColor: "text-secondary",
    newName: "Untitled Test",
    emptyChatMessage: "Say hello to start the test",
    aiTemperature: 0.2,
  },
  lesson: {
    formattedType: "Lesson",
    formattedTypeStudent: "Lesson",
    Icon: HiAcademicCap,
    iconColor: "text-info",
    newName: "Untitled Lesson",
    emptyChatMessage: "Say hello to start the lesson",
    aiTemperature: 1,
  },
  "ai-test": {
    formattedType: "AI Test",
    formattedTypeStudent: "Quiz",
    Icon: HiOutlineClipboard,
    iconColor: "text-accent",
    newName: "Untitled AI Test",
    emptyChatMessage: "Say hello to start the quiz",
    aiTemperature: 0.7,
  },
};
