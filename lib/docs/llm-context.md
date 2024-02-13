# LLM Context

## Purpose:

- At Falcon, we use LLMs to help us solve problems.
- Before asking LLM to solve a problem, it is important to provide them with context about the problem, and the environment in which the problem exists.
- Each problem will have some problem-specific context, but all problems will have a common environment context.
- This document describes the common environment context that should be provided to LLMs. It describes the FalconAI app, the mental models behind it, and the environment in which it operates.

## FalconAI

FalconAI is an AI powered educational platform with the purpose of building fully autonomous AI teachers.

## Environment

### Stack

- The FalconAI app is a web app.
- Framework: Next.js version 14 (App directory)
- Backend: Serverless functions
- Database: Supabase (Postgres)
- ORM: Prisma
- Authentication: NextAuth.js
- State Management: Jotai, Zustand
- CSS: Tailwind CSS
- Component Library: Shad/cn

### Description of the App

#### The app has 4 kinds of users:

- Admin
- Teacher
- Student
- Parent

#### How Everything is connected

## Teacher

- The teacher creates a class.
- The teacher adds students to the class. (Teacher can also remove students from the class)
- Each class can have one or more tasks.
- Each task is basically a form with different fields.
- The data in the form is like the configuration for each task.
- The data from this form is stored in the database.
- The teacher publishes the task.
  - Behind the scenes, a copy of the task is created for each student in the class.

## Student

- When the student logs in, they see the list of teachers they are enrolled with.
- When the student clicks on a teacher, they see the list of tasks that the teacher has created for them.
- The student can click on a task, and interact with an AI agent.
- The student can attempt the task multiple times, if the teacher has allowed it.
- The AI agent operates by using the context from the data filled in the form by the teacher.
- The AI agent interacts with the students using a whatsapp like chat interface.
- How the AI agent interacts with the student is determined by the data filled in the form by the teacher and the type of task.
- The student interaction with the AI agent is stored in the database.
- Once the task is completed, the student can submit the task.
- Once the task is submitted, the agent evaluates the task and provides feedback to the student.

## Teacher

- The teacher can see the reports of the student's interaction with the AI agent.
- The teacher can modify the task based on the reports.
- The teacher can change reports based on the student's interaction with the AI agent.
- The teacher then decides what the next task should be for the student.

## Admin

- The admin can see the reports of all the teachers and students.

## Database Mapping

- Most of the names are self-explanatory.
- But some need explanation.
  - BotConfig: Maps to Task in the app.
  - Bot: Maps to the task copy created for each student.
  - BotChat: Maps to each attempt of the student to complete the task.
    - isDefault: If the chat is the default chat, then it is the first chat that the student sees when they start the task.
    - Thereafter, the student can create multiple chats with the bot.
