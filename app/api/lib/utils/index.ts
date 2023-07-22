export function processStreamText(text: any) {
  if (!Array.isArray(text)) {
    return text;
  }
  let processStreamText = text.join("");
  return processStreamText;
}

export function processIdeas(ideas: any) {
  const newArray = ideas.map((obj: any) => ({
    ideaType: obj.type,
    text: processStreamText(obj.text),
  }));
  return newArray;
}

export function generateMarkdown(ideas: any) {
  const markdown = ideas.reduce((acc: any, idea: any) => {
    // Add a separator between ideas
    if (acc.length > 0) {
      acc += "\n\n";
    }
    // Add the idea type as a heading
    acc += `## ${idea.ideaType}\n\n`;
    // Add the cleaned idea text as a paragraph
    acc += `${idea.text}\n`;
    return acc;
  }, "");
  return `ideas:\n\n${markdown}`;
}

export function generateMarkdownWithoutQuiz(ideas: any) {
  const markdown = ideas.reduce((acc: any, idea: any) => {
    // Add a separator between ideas
    if (acc.length > 0) {
      acc += "\n\n";
    }
    // Add the idea type as a heading, only if it's not a quiz
    if (idea.ideaType !== "quiz") {
      acc += `## ${idea.ideaType}\n\n`;
      // Add the cleaned idea text as a paragraph
      acc += `${idea.text}\n`;
    }
    return acc;
  }, "");

  return `ideas:\n\n${markdown}`;
}
