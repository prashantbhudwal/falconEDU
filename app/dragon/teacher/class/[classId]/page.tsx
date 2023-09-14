//BUG Added this page because in the current version of next js: 13.4.9, the HMR does not work with the layout in @parallel routes without this. I had to rebuild every time to see any changes.
import { getBotsURL, getResourcesURL, getStudentsURL } from "@/lib/urls";
import { Card, CardContent } from "@/components/ui/card";
import { FiFolder } from "react-icons/fi";
import Link from "next/link";
import IconCard from "../../components/icon-card";
import { Icon } from "@radix-ui/react-select";

type ClassPageProps = {
  params: {
    classId: string;
  };
};

export default function Page({ params }: ClassPageProps) {
  const { classId } = params;
  const pages = [
    {
      name: "Bots",
      href: getBotsURL(classId),
    },
    {
      name: "Students",
      href: getStudentsURL(classId),
    },
    {
      name: "Resources",
      href: getResourcesURL(classId),
    },
  ];

  return (
    <div className="flex flex-row space-x-4">
      {pages.map((page) => {
        return (
          <Link href={page.href} key={page.href}>
            <IconCard icon={<FiFolder />} text={page.name} />
          </Link>
        );
      })}
    </div>
  );
}
