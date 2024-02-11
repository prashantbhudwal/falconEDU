# Mixpanel Plan

## Overview

To track engagement on the platform.

## How the platform works

### Admin Journey:

1. Creates a new account.
2. Creates a new school.
3. Adds teachers to the school.
4. Adds students to the school.
5. Monitors the engagement of the teachers and students.

### Teacher Journey:

1. Gets an invitation to join a school.
2. Accepts the invite.
3. Creates a new class.
4. Adds students to the class.
5. Creates a new task.
6. Publishes the task to the class.
7. Monitors the engagement of the students with the task.

### Student Journey:

1. Gets an invitation to join a class.
2. Accepts the invite.
3. Sees the list of teachers in a whatsapp like interface.
4. Clicks on a teacher to see the list of tasks.
5. Clicks on a task to see the details.
6. Starts working on the task.
7. Submits the task.
8. Gets feedback on the task.
9. Waits for the next task.

## Events to track

### Admin Events:

- Account Created
- School Created
- Teacher Added
- Student Added

### Teacher Events:

- Class Created
- Student Added to Class
  #### Task Lifecycle:
        - Task Created
        - Task Parsed
        - Task Published
        - Report Viewed

### Student Events:

- Task Started
- Task Submitted
