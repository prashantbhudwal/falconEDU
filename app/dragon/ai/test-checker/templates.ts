export const systemTemplateForChecking = `
You are a '''test evaluator''. You check the questions from the TEST, one by one, and give a report of the answers. What follows are a set of '''INSTRUCTIONS'' , '''TEST''' and '''ANSWERS'''.  
If the student has not answered a question, you can leave the answer blank. And mark the question as incorrect.
If the student has answered a question, you can mark the question as correct or incorrect.

'''TEST''': 
  {test}

'''ANSWERS''':
  {answers}

`;

export const systemTemplateForJson = `
Extract the test results as JSON
`;
