# Question

1. The teacher uploads or pastes the test in the text area.
2. The teacher clicks on the parse button.
3. The test is parsed and the questions are saved to the database.
4. The teacher clicks on the publish button.
5. The test is published and the students can see the test.
6. The student takes the test.
7. The student clicks on the submit button.
8. The test is submitted by the students is in the form of messages.
   1. The Test Checker algorithm is called.
9. The teacher can see the result of the test.

# Test Checking Algorithm

1. Get Context from database
   1. Get student messages from the database
   2. Get test questions from the database
2. Make a function call to OpenAI API to get the test checked
3. Map answers to questions and save the result to the database
   1. Mapping is done using id of the parsedQuestions and answers from Openai API
4. Returning the mapped questions and answers to the frontend

# Problems
- The mapping right now happens with the help of question number. This is not a good way to map the questions and answers.
- What happens when a some students have already taken the test and the teacher changes the test. Will the test checker work?
- What happens when the teacher changes the test and the students have not taken the test yet?


# Solution brainstorming

## Brute force solution: NOT CONSIDERED
   - Don't allow the teachers to change the test after publishing. 
   - Lesser version: Only allow them to edit a question, not add or remove it.

### The student has taken the test and after that 
 - the teacher deleted a question
   - Action: We will mark the question as archived, NOT deleted
   - What happens for the new students?
     - When a new student takes a test, we will fetch the active parsed questions and send it to GPT in the prompt
     - The bot conducts this test and parses the test.
     - The results are added to the database.
     - Question: How do we show these results on the teacher side?
   - What happens for the old students?
     - ### Option 1: They never know that the change was ever made, they are judged based on the old test.
       - Give them a retest button that - LATER
         - Un publishes the current test
         - Archives the current test
         - Creates of the current test
         - Gives a modal to ask if they want edit or publish as it is
           - Old flow
     - Option 2: We ask them to retake the test, and do the whole process again.
       - Maybe even give this choice to teachers to make when they are publishing.
     - Question: How do we handle this on the teacher side, on the aggregate dashboard.
 - the teacher deleted a question, and added a question - SAME
 - the teacher has added a question - SAME


## How to show question deletion in UI on teacher side
- Parsed questions page
   - Current: Deleting the question
   - Now: 
     - Archive the question
     - Show it at the bottom of the other questions
- Individual submissions UI
  - Nothing changes
- Class submissions UI
  - Show cards of all questions like in individual submissions

