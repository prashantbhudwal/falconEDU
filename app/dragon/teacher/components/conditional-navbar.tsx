"use client";
import Navbar from "@/components/navbar/navbar";
import { ClassNavbar } from "./navbar";
import { useSelectedLayoutSegment } from "next/navigation";
export default function ConditionalNav() {
  const layoutSegment = useSelectedLayoutSegment();
  return <>{layoutSegment === "class" ? <ClassNavbar /> : <Navbar />}</>;
}
