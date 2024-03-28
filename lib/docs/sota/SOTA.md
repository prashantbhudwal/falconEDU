# State of the App

## 28th March 2024

### App Structure

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

### Problems

1. No student engagement

   - The students don't use the app on their own. Their work is dependent on the work of the teachers.
   - The students have no incentive to use the app. It is just extra work.

2. No teacher engagement

   - The teachers have no incentive to use the app. It is just extra work.
   - The hindi language support is not good.

### Technical Challenges

#### Easy

- AIs can't work with Math.
- AIs can't generate accurate diagrams and figures.
- We don't have an app on the play store. That means students can't install the app on their phones. They have to work with a link.
- The app does not send notifications.

## On Data

If a student completes an assignment and spends 10 hours on it, but never hands in the assignment, did the assignment even happen?
Similarly, if the student keeps working on an assignment, and submits it, but the results of assignments over time are not compared, was any progress made?

So, in an education setting, isn't the proof of work and the proof of progress the two most important things?

In the current system

- ### Proof of work are things like
  - The assignment that was handed in by the student
  - The notebook that was maintained by the student
  - The homework that was handed in by the student
  - The attendance that was maintained by the student
  - The participation in the class by the student
  - The questions asked by the student
- ### Proof of progress are things like
  - The marks that the student got in the test
  - The change in marks over time

These things happen naturally in a physical classroom. But in an app, these things have to be programmed.

The app must track - the work done by the student - the progress made by the student
The app must translate these into metrics that are understandable by the teacher, and the student, and the parent, and everyone else.

Once these are tracked, then we can worry about proof of learning.

### Proof of learning

The learning is usually measured by learning goals and rubrics. This can be tracked after the proof of work and the proof of progress are tracked. TBD.

## What next?

- We will probably ship solid tracking of proof of work and proof of progress.