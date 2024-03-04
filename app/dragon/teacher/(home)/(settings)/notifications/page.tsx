"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Paper } from "@/components/ui/paper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { db } from "@/lib/routers";
import type { NotificationsByRecipient } from "@/lib/routers/notification";
import { Entity } from "@/lib/notifications";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChubbiLoading } from "@/components/loading/chubbi";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { is } from "date-fns/locale";

export default function NotificationPage() {
  // Use it in combination with react server components, fetch the data on the server and then pass it down to the client
  // And then refetch the data on the client, so that the data is always up to date
  const queryClient = useQueryClient();
  const session = useSession();
  const id = session?.data?.user?.id;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["notificationsAll"],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      const notifications = await db.notification.byRecipient({
        recipientId: id,
      });
      const idsToMarkAsRead = notifications
        .filter((n) => !n.isRead)
        .map((n) => n.id);
      await db.notification.markAsRead({ ids: idsToMarkAsRead });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      return notifications;
    },
    refetchInterval: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
  });

  if (isLoading) {
    return (
      <div className="h-screen">
        <ChubbiLoading />
      </div>
    );
  }
  if (!data) {
    return <div>No notifications</div>;
  }

  const notifications = data;

  return (
    <Paper>
      <NotificationList notifications={notifications} />
    </Paper>
  );
}

const NotificationList = ({
  notifications,
}: {
  notifications: NotificationsByRecipient;
}) => {
  return (
    <div className="">
      {notifications.map((notification) => (
        <NotificationItem notification={notification} key={notification.id} />
      ))}
    </div>
  );
};

const NotificationItem = ({
  notification,
}: {
  notification: NotificationsByRecipient[number];
}) => {
  const title = notification.title;
  const message = notification.message;
  const isRead = notification.isRead;
  const entityId = notification.activity?.event?.entityId as string;
  const entityType = notification.activity?.event?.entityType as Entity;
  // Fetch this data in the parent component and then pass it down with other notification data
  // Does not make sense to fetch this data for each notification
  const { data, isLoading } = useQuery({
    queryFn: () => db.notification.notificationUrl(entityType, entityId),
    queryKey: ["notificationUrl", entityId],
  });

  if (isLoading) {
    return (
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[10px] w-full bg-base-100" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-[10px] w-full bg-base-100" />
            <Skeleton className="h-[10px] w-full bg-base-100" />
            <Skeleton className="h-[10px] w-full bg-base-100" />
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return "Url not found";
  }

  const link = data;
  return (
    <Link href={link}>
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
            className={cn("lowercase text-white capitalize-first", {
              "text-slate-500": isRead,
            })}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={cn("lowercase text-white", {
              "text-slate-500": isRead,
            })}
          >
            {message}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
