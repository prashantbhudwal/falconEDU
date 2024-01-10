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
      className="card w-56 border hover:bg-base-200/60 hover:border-fuchsia-800 hover:-translate-y-1 group"
    >
      <figure className="bg-base-200 py-6 bg-gradient-to-t from-slate-800 to-slate-950 text-fuchsia-800 ">
        <div>
          <Avvvatars value={id} style="shape" size={100} />
        </div>
      </figure>
      <div className="card-body h-24 py-4 items-center">
        <h2 className="card-title">{getFormattedGrade({ grade })}</h2>
        {section && <div className="truncate text-sm">{section}</div>}
      </div>
    </motion.div>
  );
}
