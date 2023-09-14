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

export default async function Classes() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const classes = await getClassesByUserId(userId);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-5 items-center">
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
    </div>
  );
}
