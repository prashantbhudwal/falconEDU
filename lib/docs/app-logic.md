Teacher creates a config that creates bots on the students side.

# Task State

## Teacher Perspective

- Saved or Unsaved -> Meaning if self evident
- Publish: The task is visible to the students. The students can see the task and interact with it.
- Unpublish: The task is not visible to the students. The students cannot see the task at all, along with their responses. Its deleted for the students.
- Inactive: The students can see the task but cannot respond to the task.
- Active: The students can respond to the task.
- Hidden or Unhidden -> UI State for teachers to hide the task from the task list.
  - To be added in config.

Unpublishing Constraints:

- A task can be published and unpublished multiple times within the first first 24 hours of creation.
- The task can't be unpublished after 24 hours of creation.

### Code Logic

Publish - Set isPublished to true in the task config. - Create copies of config for each student in the class. - Checking if the config is already created for the student.

Unpublish - Set isPublished to false in the config.

Active(Unarchive) - Set isActive to true in the config.

InActive - Set isActive to false in the config.

## Student Perspective

- Published: The student can see the task and interact with it.
- Unpublished: The student cannot see the task at all, along with their responses. Its deleted for the students.
- Active: The student can respond to the task.
- Inactive: The student can see the task but cannot respond to the task.
- Hidden or Unhidden -> UI State for students to hide the task from the task list.
  - To be added in bot.

### Code Logic

Published - Check isPublished in the config attached to the bot. - If true, the student can see the task and interact with it.

Unpublished - Check isPublished in the config attached to the bot. - If false, the student cannot see the task at all, along with their responses.

Active - Check isActive in the config attached to the bot. - If true, the student can respond to the task.

InActive: We may call the as expired on the student side. - Check isActive in the config attached to the bot. - If false, - the student cannot respond to the task. - the task is greyed out in the task list.
---

# Submission Logic

## Old State

- Multiple Attempts
  - When the submit button is pressed,
    - then the botChat isSubmitted is set to true
    - bot is not updated
- Single Attempt
  - When the submit button is pressed,
    - the botChat isSubmitted is set to true
    - bot is updated, isSubmitted is set to true

## New State

- No database changes required
- Run the script on production
- Make UI changes
  - Multiple Attempts
    - Show submitted status on the attempts as well
    - Show number of attempts on the the chatCard
  - Single Attempt
    - Show submitted status on on the chatCard
