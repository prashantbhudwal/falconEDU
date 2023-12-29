import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NewClassCard } from "./components/new-class-card";
import Link from "next/link";
import { getClassURL } from "@/lib/urls";
import Avvvatars from "avvvatars-react";
import ClassCard from "./components/class-card";
import { Paper } from "@/components/ui/paper";
import { notFound, redirect } from "next/navigation";
import { db } from "./routers";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/navbar/navbar";

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
    <div className="flex flex-col min-w-full h-screen">
      <Navbar />
      <Paper className="h-full w-full overflow-y-auto custom-scrollbar bg-base-300 flex flex-col justify-between space-y-6">
        <div className="flex flex-row gap-10 flex-wrap">
          <NewClassCard />
          {activeClasses.map((classData) => (
            <Link href={getClassURL(classData.id)} key={classData.id}>
              <ClassCard
                className="rounded-lg"
                icon={
                  <Avvvatars value={classData.id} style="shape" size={60} />
                }
                name={classData.name}
              />
            </Link>
          ))}
        </div>
        {archivedClasses.length > 0 && (
          <div className=" flex flex-col gap-4">
            <Accordion
              type="single"
              collapsible
              className="rounded-lg ring-base-200 ring-1"
            >
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-slate-500 text-xl font-bold hover:no-underline bg-base-200 px-2 ">
                  Archived
                </AccordionTrigger>
                <AccordionContent className="border-none px-2 py-4">
                  <div className="flex flex-row gap-10">
                    {archivedClasses.map((classData) => (
                      <Link href={getClassURL(classData.id)} key={classData.id}>
                        <ClassCard
                          className="rounded-lg"
                          icon={
                            <div className="text-base-100">
                              <Avvvatars
                                value={classData.id}
                                style="shape"
                                size={80}
                              />
                            </div>
                          }
                          name={classData.name}
                        />
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </Paper>
    </div>
  );
}
