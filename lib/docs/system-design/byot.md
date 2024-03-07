# Build your own teacher

## Current Situation on the data model level

In our app, the teacher can create tasks and assign it to the students. The bot will conduct the task with the student in the whatsapp like chat format.

This works as follows

- When teacher signs up, two things happen
  - The next auth google provider adds the details to the database, in the default tables.
  - We programatically create a teacher profile, in the TeacherProfile table; the teacher profile table is linked to the user table in a one to one relationship.
- The teacher now has all the privileges to create a class, and add students and tasks to the class.
- The teacher creates a class, and adds students to the class.
- The teacher can select from the n types of task templates, and create a task.
  - Each task is stored in a table called BotConfig.
  - Each task template is a simple nextJs page, with a form, and a submit button.
  - The data collected through this form is stored in the preference field of the table.
- After creating the task, the teacher can publish the task.
  - When a teacher publishes the task, an entry is made in the bot table of each student in the class. The bot is the student's instance of the botConfig.
  - A student has one-to-one relationship with the user table, and a one-to-many relationship with the bot table.
- The student can then chat with the bot.
  - The chat gets stored in the botChat table.
  - If the teacher has allowed multiple attempts, the student can chat with the bot multiple times.
  - For each attempt, a new entry is made in the botChat table.
  - If the chat is a single attempt chat, which is true for most of the tasks, the botChat table will have only one entry.
  - This entry will be marked as isDefault.
- When the student submits the task, the botChat table is marked as isSubmitted.
- The teacher can then review the task, or allow auto-checking for the task.

## New Idea

- We want to allow the student to be able to create their own teachers.
- The idea is that give them one chat interface where they can chat with a teacher creator, and create a teacher.
- Once the teacher creator has enough information, it would create 3 options for the teacher profiles for the student.
  - The student can then pick one of the teacher profiles, and create a teacher.
- A teacher would basically be a configuration that would be stored.
  - This configuration would be used in the system prompt of the llm, when the student is chatting with the teacher.
- This teacher can then pick from the task types that are available and create a task on the fly, based on the current state of the chat with the student.
- The teacher will then hold till the student completes the task, and then review the task.
- It will then decide if the student has passed the task or not.
- It will also choose to decide if it should suggest a new task to the student or not.

## Integration with the old idea

- If the student is enrolled in the school, the human teacher will be able to see the teacher created by the student.
- The human teacher will be able to review the tasks created by the student's teacher.
- The human teacher will be able to guide the AI teacher, and suggest new tasks to the AI teacher.

## Use case

### One

- Suppose a student wants to talk to a career counselor.
- The student can talk to the teacher creator, and create a career counselor for themselves.
- This counselor will then guide the student through the career counseling process.

### Two

- Suppose a student wants to learn a new language.
- The student can talk to the teacher creator, and create a language teacher for themselves.
- This teacher will then guide the student through the language learning process.

## Current Data Model

## NEW Data Model

## What is the secret sauce?

- The teacher that was spun up by the student, it would have the context for the student.
- The teacher would know from history, what the student likes or dislikes.

## LLM Structure

The LLM integration will happen at two levels.

- Teacher Creator LLM
- Teacher Creator Tool
- Teacher LLM

Thereafter, the LLM integration is the same as the old system. The AI teacher is just another teacher.

### Teacher Creator LLM

The teacher creator LLM will be a simple chat interface with a some initial prompts to guide student to create a teacher. For this the plan is to use the basic gpt3.5 level models.

This model will have a tool to create a teacher. Once the llm decides it is the correct time to invoke the tool, it will invoke the tool and provide the student will the options for the teacher.

### Teacher Creation Tool

Since the teacher creator tool is the most mission critical part of the system, we will use the gpt4 level models to create the teacher. This will ensure the quality of the system prompts.

## Creator - Tool Integration

The creator will have all the information about the tool invocations. This will ensure that the creator will not give the same tool data again. (This is written here because even though our current system invokes tools, it does not save the tool invocation data in the database. This way the llm has no knowledge about the tool invocations. This leads to the same tool being invoked again and again.)

### Teacher LLM

The teacher LLM will again be a simple chat interface with a some initial prompts to guide student to create a teacher. For this the plan is to use the basic gpt3.5 level models. However, this is different in a way from the old system in a way that, it will have access to tasks as tools, and will recommend the tasks to the student. This way the student can create a teacher, and then the teacher can create tasks for the student.

## Generative UI

Until this point all the chat interfaces at Falcon were just chat messages, now we will use vercel's AI sdk to integrate UI components into the chat messages. This way then teh creator recommends a teacher, the teachers will be shown as cards in the chat interface. The student can then select one of the teachers.

Similarly, when the teacher recommends a task, the task will be shown as a card in the chat interface. The student can then select one of the tasks.

We will also work in a way that when a student completes a task, the teacher llm will be paused until it has the results of these tasks, and then it will chat with the student again. This way, it will be ensured that the learning path is maintained. We might also ask the LLM to create learning paths for the students, instead of just one task at a time. This way the student will be able to learn in a more structured way.

## Technical Challenges

- How do we integrate the UI components into the chat messages?
  - Although we have the vercel's AI sdk, we will have to learn how to use it, and then integrate it into the chat messages.
  - We probably will have to make new chat components for this.
- What will we do for the profile pictures for the AI teachers?
  - Can we use predefined images for the AI teachers? Is there a library for this?

## Big Problems that we will face

- The inability of the AI to deal with Math and diagrams, will still be a problem.
- The AI is still not multi-modal, and will not be able to understand the images and videos that the student might send.
- The AI does not work with images, emojis, and videos.

## The problems, that are not really problems

- The AI is not good enough. We will not solve this problem for now. Over time, the AI will get better, and we will be able to use the better AI models.
- The AI is not multi-modal. We will not solve this problem for now. Over time, the AI will get better, and we will be able to use the better AI models.
- The AI is expensive. Like CPUs and memory, the cost of AI will also go down over time.
- The AI does not have a long context window. We are already at 1 million tokens with the latest models. That is approximately equal to 10 books. This is enough for most of the tasks that we are doing. And since we believe that the cost of AI will go down, the context window will not be a problem in the future.

<!-- Product and Business -->

## Advantages

- The students are not dependent on the teachers to learn.
- They can learn in a truly self-directed way.
- The students who are not enrolled in the class can also learn from the teacher.

## Disadvantages

- The AI might not be able to provide the same level of guidance as a human teacher.

## Business

- Since our current app allows the teachers to create tasks, and is human guided.
- This new feature will allow the students who are not yet enrolled in the class to understand how the app works.
- This will allow schools who purchase our app to increase admissions by allowing the students to try the app before enrolling in the school.
- This will also allow the current students to not be dependent on the teachers to learn.

<!-- Old: Only read if curious -->

What do we need to design?

## Situation:

A teacher creates a task, and a bot conducts the task with the student in the whatsapp like chat format.

## Complication 1: Learning is teacher dependent.

## Complication 2: The bot visibility is restricted to the students in the class.

- What if a student is not enrolled in the class but just wants to try the task before enrolling?

## Solutions:

- Create a master bot for each teacher

  - The master bot is visible to all students in the class
  - And, if made public, is available to all the people who come the schools workspace in the falconai app.

- Create public bots, which is visible to everyone who comes to the platform.
