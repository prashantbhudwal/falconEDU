import { teacherPageURL } from "@/lib/urls";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SchoolIcon, StudentIcon, TeacherIcon } from "@/components/icons";

const useOrgSettingsCards = (): {
  name: string;
  link: string;
  description: string;
  icon: React.ReactNode;
}[] => {
  return [
    {
      name: "Manage Organization",
      link: teacherPageURL,
      description: "Change brand, admins and logo",
      icon: <SchoolIcon size={"lg"} color="primary" />,
    },
    {
      name: "Manage Teachers",
      link: teacherPageURL,
      description: "Add or remove teachers to your organization",
      icon: <TeacherIcon size={"lg"} color="secondary" />,
    },
    {
      name: "Manage Students",
      link: teacherPageURL,
      description: "Add or remove students to your organization",
      icon: <StudentIcon size={"lg"} color="accent" />,
    },
  ];
};

export default async function OrgSettings() {
  const orgSettingsCards = useOrgSettingsCards();
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

export function SettingsCard({
  name,
  link,
  description,
  icon,
}: {
  name: string;
  link: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link href={link}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center space-x-7">
          <div>{icon}</div>
          <div className="flex flex-col space-y-2">
            <CardTitle>{name}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
