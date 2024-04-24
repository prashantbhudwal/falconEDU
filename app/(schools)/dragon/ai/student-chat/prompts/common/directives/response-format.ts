import endent from "endent";
import { DirectiveObject, getDirectiveFromList } from "../../../../utils";

const basicLatexDirective: DirectiveObject = {
  directives: [
    "Always give inline math in latex surrounded by $<latex here>$.",
    "Always give block level math in latex surrounded by $$<latex here>$$. ",
    "Always give inline chemical equations in latex surrounded by $<latex here>$.",
    "Always give chemical equations in latex surrounded by $$<latex here>$$.",
  ],
};

const hasEquationsDirective: DirectiveObject = {
  title: "LATEX",
  description:
    "The content provided to you has equations or math present in it. These equations should be written in LATEX:",
  directives: [
    "Always give inline math in latex surrounded by $<latex here>$.",
    "Always give block level math in latex surrounded by $$<latex here>$$. ",
    "Always give inline chemical equations in latex surrounded by $<latex here>$.",
    "Always give chemical equations in latex surrounded by $$<latex here>$$.",
  ],
};

export const getResponseFormatDirective = ({
  hasEquations,
  inMarkdown = true,
}: {
  hasEquations: boolean | undefined;
  inMarkdown?: boolean;
}) => {
  let directiveOptions: any;
  console.log("hasEquations", hasEquations);
  console.log("inMarkdown", inMarkdown);
  if (hasEquations) {
    directiveOptions = {
      title: hasEquationsDirective.title,
      directives: hasEquationsDirective.directives,
      description: hasEquationsDirective.description,
      autoMarkdown: inMarkdown,
    };
    console.log("directiveOptions", directiveOptions);
  } else if (!hasEquations) {
    directiveOptions = {
      directives: basicLatexDirective.directives,
      autoMarkdown: false,
      bullet: inMarkdown ? "##" : undefined,
    };
    console.log("directiveOptions", directiveOptions);
  }
  console.log("directiveOptions", directiveOptions);
  const directives = getDirectiveFromList(directiveOptions);
  console.log("directives", directives);
  const directivesBody = directiveOptions ? [directives] : [];
  console.log("directivesBody", directivesBody);

  return endent`
RESPONSE FORMAT INSTRUCTIONS STARTS HERE
${directivesBody.join("\n")}
RESPONSE FORMAT INSTRUCTIONS ENDS HERE
`;
};

export const LATEX_DIRECTIVE = getDirectiveFromList({
  directives: basicLatexDirective.directives,
  autoMarkdown: false,
  bullet: "##",
});

export const RESPONSE_FORMAT_DIRECTIVE = endent`
RESPONSE FORMAT STARTS HERE
${getDirectiveFromList({
  directives: basicLatexDirective.directives,
  autoMarkdown: false,
  bullet: "##",
})}
RESPONSE FORMAT ENDS HERE
`;
