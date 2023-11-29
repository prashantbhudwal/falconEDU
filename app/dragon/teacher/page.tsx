import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NewClassCard } from "./components/new-class-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getBotsURL, getSettingsUrl } from "@/lib/urls";
import Avvvatars from "avvvatars-react";
import ClassCard from "./components/class-card";
import { getClassesByUserId } from "./queries";
import { Paper } from "@/components/ui/paper";
import { arch } from "os";

export default async function Classes() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const classes = await getClassesByUserId(userId);

  const activeClasses = classes.filter((classData) => classData.isActive);
  const archivedClasses = classes.filter((classData) => !classData.isActive);

  return (
    <Paper className="h-full w-full overflow-y-auto custom-scrollbar bg-base-300 flex flex-col space-y-6">
      <div className="flex flex-row gap-10 flex-wrap min-h-[40%]">
        <NewClassCard />
        {activeClasses.map((classData) => (
          <Link href={getSettingsUrl(classData.id)} key={classData.id}>
            <ClassCard
              className="rounded-lg"
              icon={<Avvvatars value={classData.id} style="shape" size={80} />}
              name={classData.name}
            />
          </Link>
        ))}
      </div>
      {archivedClasses.length > 0 && (
        <div className=" flex flex-col gap-4">
          <h2 className="text-2xl text-slate-600">Archived</h2>
          <Separator />
          <div className="flex flex-row gap-10">
            {archivedClasses.map((classData) => (
              <Link href={getSettingsUrl(classData.id)} key={classData.id}>
                <ClassCard
                  className="rounded-lg"
                  icon={
                    <div className="text-base-100">
                      <Avvvatars value={classData.id} style="shape" size={80} />
                    </div>
                  }
                  name={classData.name}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
}
