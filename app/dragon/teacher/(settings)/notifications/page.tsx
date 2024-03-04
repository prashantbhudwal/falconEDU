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

export default function NotificationPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const id = session?.data?.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", id],
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
    refetchOnMount: "always",
  });

  if (isLoading) {
    return (
      <div>
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

  const { data, isLoading } = useQuery({
    queryFn: () => db.notification.notificationUrl(entityType, entityId),
    queryKey: ["notificationUrl", entityId],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[10px] w-full" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-[10px] w-full" />
            <Skeleton className="h-[10px] w-full" />
            <Skeleton className="h-[10px] w-full" />
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
            className={cn("lowercase capitalize-first", {
              "text-slate-500": isRead,
            })}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={cn("lowercase", {
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
