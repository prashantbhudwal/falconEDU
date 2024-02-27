/**
 *  This function takes in a list of directives and returns a string with the directives formatted in markdown.
 * @example
 * ```ts
 * const directives = ["Always give inline math in latex surrounded by $<latex here>$.", "Always give chemical equations in latex surrounded by $<latex here>$."];
 * const formattedDirectives = getDirectiveFromList("Latex", "Follow the following instructions while rendering latex", directives);
 * console.log(formattedDirectives);
 * ```
 * @output
 * ## Latex
 * Follow the following instructions while rendering latex
 *  - Always give inline math in latex surrounded by $<latex here>$.
 *  - Always give chemical equations in latex surrounded by $<latex here>$.
 */

import endent from "endent";

type DirectiveFromList = {
  title?: string;
  description?: string;
  directives: string[];
  autoMarkdown?: boolean;
  isNumbered?: boolean;
  headingLevel?: number;
  bullet?: string;
  noBullet?: boolean;
};

export const getDirectiveFromList = ({
  title,
  description,
  directives,
  autoMarkdown = true,
  headingLevel = 2,
  isNumbered = false,
  bullet = "-",
  noBullet = false,
}: DirectiveFromList) => {
  const directiveTitle = (() => {
    if (title) {
      return autoMarkdown ? `${"#".repeat(headingLevel)} ${title}` : title;
    }
  })();
  const formattedDirectives = directives.map((directive, index) =>
    autoMarkdown
      ? noBullet
        ? directive
        : isNumbered
          ? `${index + 1}. ${directive}`
          : `${bullet} ${directive}`
      : directive,
  );
  const directiveList = formattedDirectives.join("\n");
  const promptArray = [directiveTitle, description, directiveList].filter(
    Boolean,
  );
  return endent`
${promptArray.join("\n")}
`;
};

export type DirectiveObject = Omit<
  DirectiveFromList,
  "autoMarkdown" | "markdown"
>;
