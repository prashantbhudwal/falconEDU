import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { cache } from "react";
import prisma from "@/prisma";
import { NewClassCard } from "./components/new-class-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getBotsURL } from "@/lib/urls";
import Avvvatars from "avvvatars-react";
import ClassCard from "./components/class-card";
import { getClassesByUserId } from "./queries";
import { Paper } from "@/components/ui/paper";

export default async function Classes() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const classes = await getClassesByUserId(userId);
  return (
    <Paper className="h-full w-full overflow-y-auto custom-scrollbar bg-base-300">
      <div className="flex flex-row gap-10 items-center flex-wrap">
        <NewClassCard />
        {classes.map((classData) => (
          <Link href={getBotsURL(classData.id)} key={classData.id}>
            <ClassCard
              icon={<Avvvatars value={classData.id} style="shape" size={120} />}
              name={classData.name}
            />
          </Link>
        ))}
      </div>
    </Paper>
  );
}
