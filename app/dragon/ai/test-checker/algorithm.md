# Test Checking Algorithm

1. Get Context from database
   1. Get student messages from the database
   2. Get test questions from the database
2. Make a function call to OpenAI API to get the test checked
3. Map answers to questions and save the result to the database
   1. Mapping is done using id of the parsedQuestions and answers from Openai API
4. Returning the mapped questions and answers to the frontend
