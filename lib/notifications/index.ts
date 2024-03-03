import { UserType } from "@prisma/client";
import {
  Event,
  SystemEvent,
  Reaction,
  ReactionType,
  Activity,
  Notification,
} from "@prisma/client";

export type Entity = "TASK" | "PROFILE";

type NotificationData = Pick<Notification, "title" | "message" | "metadata">;

type TaskActions = "PUBLISH" | "SUBMIT";
type ProfileActions = "VIEW" | "SUBMIT";

export type EntityActions = {
  TASK: TaskActions;
  PROFILE: ProfileActions;
};
type UserEntityActions = {
  [K in USER]?: {
    [E in ENTITY]?: Partial<Record<EntityActions[E], NotificationData>>;
  };
};

/**
 create an api of the format 
 events.userType.entityType.actionType
 register(eventType, userType, entityType, actionType, notificationData)
 events.teacher.task.publish({
    entityId: botConfigId,
    recipientId: student.userId,
    activity:{

    }
 })
 register("teacher","task","publish",{
    
 })


 **/
