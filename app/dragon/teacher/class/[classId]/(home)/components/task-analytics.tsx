import React from "react";
import { BiChat } from "react-icons/bi";
import { PiPercentBold } from "react-icons/pi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { TypeGetTaskStats } from "@/app/dragon/teacher/routers/studentRouter";
import { FaBookOpenReader } from "react-icons/fa6";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const TaskAnalytics = ({ analytics }: { analytics: TypeGetTaskStats }) => {
  if (!analytics) return null;

  const interaction = `${analytics.totalInteractedStudents}/${analytics.totalCurrentStudents}`;
  const iteractionPercentage = analytics.percentageOfStudentsInteracted;
  const submittedStudents = `${analytics.totalSubmittedStudents}/${analytics.totalCurrentStudents}`;
  const chatCount = analytics.chatCount;

  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex items-center gap-1 hover:border-b">
        <FaBookOpenReader />
        <span className="text-xs">{interaction}</span>
      </div>
      <div className="flex items-center gap-1">
        <IoChatbubbleEllipsesOutline />
        <span className="text-xs">{chatCount}</span>
      </div>
      {analytics.totalSubmittedStudents !== null && (
        <div className="flex items-center gap-1">
          <HiOutlineClipboardDocumentCheck />
          <span className="text-xs">{submittedStudents}</span>
        </div>
      )}
    </div>
  );
};

export default TaskAnalytics;
