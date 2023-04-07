"use client";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "@/app/merlin/CanvasBlock";
import useFalconStream from "@/hooks/useFalconStream";
import { useAppState } from "../context/app-context";
import { getEmoji } from "../utils";
import { v4 as uuid } from "uuid";
import LiveBlock from "@/app/merlin/LiveBlock";

interface BlockContent {
  text: string | string[];
  id: string;
  type: string;
  emoji: string;
}

export default function Canvas({ className }: { className?: string }) {
  const { topic, subtopic, currentLesson } = useAppState();
  console.log(currentLesson);

  return <></>;
}
