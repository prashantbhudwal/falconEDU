"use client";
import { Card } from "@/components/ui/card";
import { Class } from "@prisma/client";
import { getFormattedGrade } from "../../lib/helpers";
import { Grade } from "@prisma/client";
import Avvvatars from "avvvatars-react";
import { motion } from "framer-motion";

type ClassCardProps = {
  className?: string;
  grade: Grade;
  section?: Class["section"];
  id: Class["id"];
};

export function ClassCard({
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
      transition={{ type: "spring", stiffness: 90, damping: 10 }}
      layout
      whileHover={{ translateY: -10 }}
      className="group group card w-36 hover:-translate-y-1 md:w-48"
    >
      <Card className="border border-slate-700">
        <figure className="bg-gradient-to-t from-slate-900 to-slate-950 py-6 text-fuchsia-800 group-hover:from-fuchsia-900 ">
          <div>
            <Avvvatars value={id} style="shape" size={70} />
          </div>
        </figure>
        <div className="card-body h-20 items-center border-t border-t-slate-800 py-2 md:h-20 ">
          <h2 className="card-title group-hover:text-fuchsia-700">
            {getFormattedGrade({ grade })}
          </h2>
          {section && (
            <div className="truncate text-xs md:text-sm">{section}</div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
