import { url } from "@/lib/urls";
import {
  AdminIcon,
  SchoolIcon,
  StudentIcon,
  TeacherIcon,
} from "@/components/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { db } from "@/lib/routers";
import { AdminRole } from "@prisma/client";
import { SettingsCard } from "./setting-card";

export default async function OrgSettings() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  const adminRole = await db.org.getAdminRoleByUserId({ userId });
  if (!adminRole) return null;
  const orgId = await db.org.getOrgIdByUserId({ userId });
  if (!orgId) return null;

  const orgSettingsCards = getOrgSettingCardData({ role: adminRole });
  return (
    <div className="flex flex-col space-y-4">
      {orgSettingsCards.map((card) => (
        <SettingsCard
          key={card.name}
          name={card.name}
          link={card.link(orgId)}
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
  link: (orgId: string) => string;
  description: string;
  icon: React.ReactNode;
  role: AdminRole;
}[] => {
  const orgSettingsCards = [
    {
      name: "Manage Organization",
      link: url.orgAdmin.manage.org,
      description: "Change brand, name, etc.",
      icon: <SchoolIcon size={"lg"} color="primary" />,
      role: "SUPER_ADMIN",
    },
    {
      name: "Manage Admins",
      link: url.orgAdmin.manage.admins,
      description: "Add or remove admins",
      icon: <AdminIcon size={"lg"} color="info" />,
      role: "SUPER_ADMIN",
    },
    {
      name: "Manage Teachers",
      link: url.orgAdmin.manage.teachers,
      description: "Add or remove teachers",
      icon: <TeacherIcon size={"lg"} color="secondary" />,
      role: "MANAGER",
    },
    {
      name: "Manage Students",
      link: url.orgAdmin.manage.students,
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
