import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const SettingsCard = ({
  name,
  link,
  description,
  icon,
}: {
  name: string;
  link: string;
  description: string;
  icon?: React.ReactNode;
}) => {
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
};
