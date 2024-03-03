import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Paper } from "@/components/ui/paper";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Notification } from "@prisma/client";
import Link from "next/link";

type NotificationData = Pick<
  Notification,
  "id" | "title" | "message" | "isRead"
> & {
  link: string;
};

const notificationData: NotificationData[] = [
  {
    id: "1",
    title: "Teacher assigned a new bot",
    message: "Click here to view the task.",
    isRead: false,
    link: "/dragon/teacher/settings/notifications",
  },
  {
    id: "2",
    title: "Teacher assigned a new test",
    message: "Click here to view the task.",
    isRead: false,
    link: "/dragon/teacher/settings/notifications",
  },
  {
    id: "3",
    title: "Teacher assigned a new lesson",
    message: "Click here to view the task.",
    isRead: true,
    link: "/dragon/teacher/settings/notifications",
  },
  {
    id: "4",
    title: "Teacher assigned a new ai-test",
    message: "Click here to view the task.",
    isRead: true,
    link: "/dragon/teacher/settings/notifications",
  },
  {
    id: "5",
    title: "Teacher assigned a new test",
    message: "Click here to view the task.",
    isRead: true,
    link: "/dragon/teacher/settings/notifications",
  },
];

export default async function NotificationPage() {
  return (
    <Paper>
      <NotificationList />
    </Paper>
  );
}

const NotificationList = () => {
  return (
    <div className="">
      {notificationData.map((notification) => (
        <NotificationItem notification={notification} key={notification.id} />
      ))}
    </div>
  );
};

const NotificationItem = ({
  notification,
}: {
  notification: NotificationData;
}) => {
  const title = notification.title;
  const message = notification.message;
  const isRead = notification.isRead;
  return (
    <Link href={notification.link}>
      <Card
        className={cn(
          "flex max-w-5xl flex-col rounded-none border-base-200 bg-transparent hover:bg-base-200",
          {
            "border-l-4 border-l-fuchsia-900": !isRead,
          },
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn({
              "text-slate-500": isRead,
            })}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={cn({
              "text-slate-600": isRead,
            })}
          >
            {message}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
