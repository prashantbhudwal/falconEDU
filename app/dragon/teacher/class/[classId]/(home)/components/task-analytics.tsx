import React from "react";
import { BiChat } from "react-icons/bi";
import { PiPercentBold } from "react-icons/pi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { TypeGetTaskStats } from "@/app/dragon/teacher/routers/studentRouter";
import { UserIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const TaskAnalytics = ({ analytics }: { analytics: TypeGetTaskStats }) => {
  if (!analytics) return null;

  const interaction = `${analytics.totalInteractedStudents}/${analytics.totalCurrentStudents}`;
  const iteractionPercentage = analytics.percentageOfStudentsInteracted;
  const submittedStudents = `${analytics.totalSubmittedStudents}/${analytics.totalCurrentStudents}`;
  const chatCount = analytics.chatCount;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div className="flex items-center space-x-4 px-2 py-1 hover:bg-base-300 rounded">
          <div className="flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            <span className="text-xs">{interaction}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftRightIcon className="w-3 h-3" />
            <span className="text-xs">{chatCount}</span>
          </div>
          {analytics.totalSubmittedStudents !== null && (
            <div className="flex items-center gap-1">
              <HiOutlineClipboardDocumentCheck className="w-3 h-3" />
              <span className="text-xs">{submittedStudents}</span>
            </div>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-base-300 rounded-lg" align="start">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span>Interactions:</span>
            </div>
            <span className="text-xs">{interaction}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <BiChat className="w-3 h-3" />
              <span>Chat count:</span>
            </div>
            <span className="text-xs">{chatCount}</span>
          </div>
          {analytics.totalSubmittedStudents !== null && (
            <div className="flex items-center gap-1">
              <HiOutlineClipboardDocumentCheck className="w-3 h-3" />
              <span className="text-xs">{submittedStudents}</span>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TaskAnalytics;
