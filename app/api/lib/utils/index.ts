export function processStreamText(text: any) {
  let processStreamText = text.join(" ").replace(/\s+/g, " ");
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
