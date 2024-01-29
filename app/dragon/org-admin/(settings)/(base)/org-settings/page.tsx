import {
  manageAdminsURL,
  manageOrgURL,
  manageStudentsUrl,
  manageTeachersURL,
} from "@/lib/urls";
import {
  AdminIcon,
  SchoolIcon,
  StudentIcon,
  TeacherIcon,
} from "@/components/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/lib/routers";
import { AdminRole } from "@prisma/client";
import { SettingsCard } from "./setting-card";

export default async function OrgSettings() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  const adminRole = await db.org.getAdminRoleByUserId({ userId });
  if (!adminRole) return null;
  const orgSettingsCards = getOrgSettingCardData({ role: adminRole });
  return (
    <div className="flex flex-col space-y-4 p-2">
      {orgSettingsCards.map((card) => (
        <SettingsCard
          key={card.name}
          name={card.name}
          link={card.link}
          description={card.description}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

const getOrgSettingCardData = ({
  role,
}: {
  role: AdminRole;
}): {
  name: string;
  link: string;
  description: string;
  icon: React.ReactNode;
  role: AdminRole;
}[] => {
  const orgSettingsCards = [
    {
      name: "Manage Organization",
      link: manageOrgURL,
      description: "Change brand, name, etc.",
      icon: <SchoolIcon size={"lg"} color="primary" />,
      role: "SUPER_ADMIN",
    },
    {
      name: "Manage Admins",
      link: manageAdminsURL,
      description: "Add or remove admins",
      icon: <AdminIcon size={"lg"} color="info" />,
      role: "SUPER_ADMIN",
    },
    {
      name: "Manage Teachers",
      link: manageTeachersURL,
      description: "Add or remove teachers",
      icon: <TeacherIcon size={"lg"} color="secondary" />,
      role: "MANAGER",
    },
    {
      name: "Manage Students",
      link: manageStudentsUrl,
      description: "Add or remove students",
      icon: <StudentIcon size={"lg"} color="accent" />,
      role: "MANAGER",
    },
  ] as const;

  const roleBasedCard = orgSettingsCards.filter(
    (card) =>
      card.role === role || (role === "SUPER_ADMIN" && card.role === "MANAGER"),
  );

  return roleBasedCard;
};
