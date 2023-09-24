import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { cache } from "react";
import prisma from "@/prisma";
import { NewClassCard } from "./components/new-class-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getClassURL } from "@/lib/urls";
import IconCard from "./components/icon-card";
import Avvvatars from "avvvatars-react";
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
    <Paper className="h-full">
      <div className="flex flex-row gap-5 items-center flex-wrap">
        <NewClassCard />
        {classes.map((classData) => (
          <Link href={getClassURL(classData.id)} key={classData.id}>
            <IconCard
              icon={<Avvvatars value={classData.id} style="shape" />}
              text={classData.name}
            />
          </Link>
        ))}
      </div>
    </Paper>
  );
}
