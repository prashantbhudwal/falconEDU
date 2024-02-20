import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import { getClassURL } from "@/lib/urls";
import Avvvatars from "avvvatars-react";
import ClassCard from "./components/class-card";
import { Paper } from "@/components/ui/paper";
import { notFound, redirect } from "next/navigation";
import { db } from "../../../lib/routers";
import { ClassCardList } from "./components/class-card-list";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "./components/navbar/navbar";

export default async function Classes() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const orgMode = await db.teacher.teacherHasOrgMode({ userId });
  if (!orgMode) redirect("/dragon/auth/request-access");
  const classes = await db.class.getClassesByUserId({ userId });

  const activeClasses = classes.filter((classData) => classData.isActive);
  const archivedClasses = classes.filter((classData) => !classData.isActive);

  return (
    <div className="flex h-screen min-w-full flex-col">
      <Navbar />
      <Paper className=" flex h-full w-full flex-col justify-between space-y-6 overflow-y-auto bg-base-300">
        <ClassCardList classes={activeClasses} />
        {archivedClasses.length > 0 && (
          <div className=" flex flex-col gap-4">
            <Accordion
              type="single"
              collapsible
              className="rounded-lg ring-1 ring-base-200"
            >
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="bg-base-200 px-2 text-xl font-bold text-slate-500 hover:no-underline ">
                  Archived
                </AccordionTrigger>
                <AccordionContent className="border-none px-2 py-4">
                  <ClassCardList classes={archivedClasses} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </Paper>
    </div>
  );
}
