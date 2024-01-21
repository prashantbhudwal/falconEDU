"use client";
import { getClassURL } from "@/lib/urls";
import { ClassesByUserId } from "../routers/classRouter";

import Link from "next/link";
import ClassCard from "./class-card";
import { AnimatePresence } from "framer-motion";
export const ClassCardList = ({ classes }: { classes: ClassesByUserId }) => {
  return (
    <AnimatePresence>
      <div className="flex flex-row flex-wrap gap-10">
        {classes.map((classData) => (
          <Link href={getClassURL(classData.id)} key={classData.id}>
            <ClassCard
              className="rounded-lg"
              id={classData.id}
              grade={classData.grade}
              section={classData.section}
            />
          </Link>
        ))}
      </div>
    </AnimatePresence>
  );
};
