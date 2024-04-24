"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
      className="group group w-36 hover:-translate-y-1 md:w-48"
    >
      <Card className="items-center border border-slate-700">
        <CardHeader className="items-center rounded-t-xl bg-gradient-to-t from-slate-900 to-slate-950 text-fuchsia-800 group-hover:from-fuchsia-900">
          <Avvvatars value={id} style="shape" size={70} />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-2 border-t border-t-slate-800 p-4 text-center">
          <CardTitle className=" truncate group-hover:text-fuchsia-700">
            {getFormattedGrade({ grade })}
          </CardTitle>
          {section && (
            <CardDescription className="truncate text-xs md:text-sm">
              {section}{" "}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
