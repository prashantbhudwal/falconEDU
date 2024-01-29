## AI-Test Submission

### Desired Outcome

    - The AI should tell the teacher what the student does or does not know.
    - This should be in the format that is allows the teacher to quickly get insights about student performance.

### Situation

    - The teacher gives content to the LLM
    - The LLM conducts the test on teachers behalf.
      - The content is passed in the system message of the model with the instructions on how to conduct the test.
      - The LLM takes the student through the content by asking the student questions about the content.
      - The LLM then asks the student if the test should be submitted.
      - The student submits the test.
    - The test stored in the database in the form of a chat.

### Complication

    - Showing this chat to the teacher as is, is not of much help in terms of what the teacher understands about the student's understanding of a given topic.
    - So I need to send this chat to the LLM and ask it for the analysis of the test.

### Questions

    1. What data should I should I ask the LLM for?
    2. What common parameters should I judge the students on?
    3. What structure should I ask the data in that is easy to store an process?

### Possible solutions

#### Solution 1

    - When processing the task, ask the AI to create learning objectives.
    - After the students have submitted the task
      - Ask the AI to check the test based on the learning objectives.
      - The AI judges the student on each objective on a 5 point scale
      - Calculate the grade like american grade system based on the cumulative feedback
      - Allow the teacher to send the grade to the student.
