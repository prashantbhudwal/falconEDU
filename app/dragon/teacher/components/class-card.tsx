"use client";
import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Class } from "@prisma/client";
import { getFormattedGrade } from "../utils";
import { Grade } from "@prisma/client";
import Avvvatars from "avvvatars-react";
import { motion } from "framer-motion";

type ClassCardProps = {
  className?: string;
  grade: Grade;
  section?: Class["section"];
  id: Class["id"];
};

export default function ClassCard({
  className,
  grade,
  section,
  id,
  ...props
}: ClassCardProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
      layout
      whileHover={{ translateY: -10 }}
      className="group card w-48 border hover:-translate-y-1 hover:border-fuchsia-800 hover:bg-base-200/60"
    >
      <figure className="bg-base-200 bg-gradient-to-t from-slate-800 to-slate-950 py-6 text-fuchsia-800 ">
        <div>
          <Avvvatars value={id} style="shape" size={70} />
        </div>
      </figure>
      <div className="card-body h-20 items-center py-2">
        <h2 className="card-title">{getFormattedGrade({ grade })}</h2>
        {section && <div className="truncate text-sm">{section}</div>}
      </div>
    </motion.div>
  );
}
