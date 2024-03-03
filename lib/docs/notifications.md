# Notification System @ FalconAI

Our objective is to notification system for FalconAI.

## Basic system

In-app notifications

1. Create notification models in the database.
2. Decide on the notification triggers that add the data to the notification models.
   1. When an event occurs, it triggers a prisma query to add a row/rows in the database.
3. Create a UI on the teacher side to poll for data.
4. Clear old notifications periodically by running a chron job or a script.

Push notifications
The procedure remains the same, but another step is added in step 2

1. ...
2. ...
   1. ...
   2. Send the API request to the service worker to send the push notification to the user

## User journeys

### Flow: Task assignment and submission

Players: `teacher` & `student`

1. The `teacher` publishes a task for a task.
2. The `student` receives a notification that a task has been created
   1. On clicking the notification, the `student` is taken to the task page
   2. The `student` can also see the notifications in the notification bell on their header
   3. In case where the `student` is online and browsing the app while a notification is received, they see both the notification on the app, and the badge on the notification icon.
3. The `student` completes the task and submits it.
4. The `teacher` is notified of the completion.
5. The `teacher` receives the result and can choose to send kudos to the `student`.
6. If kudos is sent, the `student` receives a notification and their cred with the teacher increases.

## Assumptions and thinking

The notification system is constrained work for

- web app
- using only postgres and prisma
- low scale mvp

A notification in our app can be triggered in two ways

1. Triggered by User
2. Triggered by System

### User Notifications

The notifications triggered by users will always be triggered by a sender. That is, in such notifications there will always be a sender and a receiver. We call the notifications triggered by users as `User Notifications`.

A user can never send itself a notification. It can only interact with a system, that may send it a notification in real time or after a delayed interval. So, a self notification is just a system notification with the _type_ of _SELF_.

Our system has many entities, on which a user can perform actions. When a user action on an entity is of note for another user, that is when a notification is sent. Therefore, a user notification, will always a have the following data attached to it. We will store this data in the database.

1. Sender: Who triggered the notification, ie, who took an action.
2. Receiver: To whom is this notification of use, ie who this action directly or indirectly affects
3. Entity: What part of the app did the sender take action on.
4. Action: What action did the sender take.
5. Creation Time: When did the sender take the action.
6. Reading Time: When did the receiver read the notification

This data should be sufficient to construct a notification for the user. However, for performance purposes, we also store this constructed information.

1. Title: Sender did an Action to an Entity
2. Message: Details of the entity, or action, or sender.
3. Payload: Any additional context required to understand the notification like links, comments, dates, etc.

Note that, as we mentioned before, all this data is already in the database somewhere, the point of semantic denormalization here is to add all the context to the notification that is needed to understand this notification.

When to construct the semantic information?

For now, we will do this on write time. We understand that this might not be the best method but since the worst case in our app is an admin notifying the whole school at once, ie even with the big schools, it is 2-3k students, we should be able to handle this.

### System Notifications (Refactor)

A system notification is any notification where the system chooses to notify the user, ie, all notifications where the decision to deliver the notification is taken by the system. This might be of different types. Chron triggered, external tool triggered, user behavior triggered. The litmus test for such notifications is the absence of a human sender. Note that the user is the part of the system, but the system notification is not just because of one action of the user, but because of the interactions in the system where the user exists. The user may or may not be part of this interaction.

Let's say we want to trigger a notification where the user is notified when they step into their school. Here although the user is involved generation of the notification, the notification did not get triggered...tbd
{Now I am thinking of it, wont a user entering a geo location would just be like user entering a certain section of the app, but in a physical world. So if we are calling the user entering a page a user triggered notification, why would we call a second one, system triggered. }

### Data Model

```prisma
model Notification {
  id        Int      @id @default(autoincrement())
  title     String
  message   String
  payload   Json
  sender    User
  receiver  User[]
  entity    Entity
  action    String
  createdAt DateTime @default(now())
  readAt    DateTime?
}
```

```ts
type USER = "TEACHER" | "STUDENT" | "ADMIN" | "PARENT";

type SENDER = USER;

type RECEIVER = USER;

type ENTITY = "TASK" | "PROFILE";

type Notification = {
  title: string;
  message: string;
  payload: {
    link: string;
  };
};

type RoleNotifications = {
  [K in ENTITY]?: {
    PUBLISH?: Notification;
    SUBMIT?: Notification;
  };
};

type Template = {
  [K in USER]: RoleNotifications;
};

const template = {
  TEACHER: {
    TASK: {
      PUBLISH: {
        title: "{teacherName} assigned a new {taskType}",
        message:
          "The submission date is {submissionDate}. Click here to view the task.",
        payload: {
          link: "https://falconai.com/teacher/tasks/123",
        },
      },
    },
    PROFILE: {
      VIEW: {
        title: "{teacherName} viewed your profile",
        message: "Click here to view their profile.",
        payload: {
          link: "https://falconai.com/teacher/profile/123",
        },
      },
    },
  },
  STUDENT: {
    TASK: {
      SUBMIT: {
        title: "{studentName} submitted a the {taskType}",
        message: "{taskName} was submitted. Click here to view the task.",
        payload: {
          link: "https://falconai.com/student/tasks/123",
        },
      },
    },
    PROFILE: {
      VIEW: {
        title: "{teacherName} viewed your profile",
        message: "Click here to view their profile.",
        payload: {
          link: "https://falconai.com/student/profile/123",
        },
      },
    },
  },
};

type Templates = typeof template;

const notificationObject = {};
```

## Possible notifications

### For students

- Entity: Task

  - Actor: Teacher
    - Action: Publish
      - Notification: Mary assigned you a test
      - Template: {teacherName} assigned you a {taskType}
    - Action: Remind
      - Notification: Mary reminded you to submit the test
      - Template: {teacherName} reminded you to submit the {taskType}
  - Actor: Peer Student
    - Action: submit
      - Notification: John submitted the test
      - Template: {studentName} submitted the {taskType}

- Entity: Task
  - Actor: Teacher
    - Action: Publish
      - Recipient:
        - Student
          - Notification: Mary assigned you a test
          - Template: {teacherName} assigned you a {taskType}
      - Recipient:
        - Parent
          - Notification: Mary assigned a test to John
          - Template: {teacherName} assigned a {taskType} to {studentName}
    - Action: Remind
      - Recipient:
        - Student
          - Notification: Mary reminded you to submit the pending test
          - Template: {teacherName} reminded you to submit the pending {taskType}
        - Parent
          - Notification: Mary reminded John to submit the test
          - Template: {teacherName} reminded {studentName} to submit the {taskType}
  - Actor: Student
    - Action: Submit
    - Recipient:
      - Teacher
        - Notification: John submitted the test
        - Template: {studentName} submitted the {taskType}
      - Peer Student
        - Notification: John just submitted the test
        - Template: {studentName} submitted the {taskType}
    - Action: Start
      - Recipient:
        - Peer Student
          - Notification: John just started the test
          - Template: {studentName} started the {taskType}

## Subscriptions

- Each user has some subscribers

## Events, Activity Feed, and Notifications

Events happen when a user interacts with an entity. These events are stored in the database in a model.

The events are used to construct th