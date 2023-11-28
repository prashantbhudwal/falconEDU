import * as Z from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const chapterSchema = Z.object({
  chaptersArray: Z.array(Z.string().describe("The array of chapters")),
}).describe("The object containing the array of chapters");

export type PredictedChaptersObject = Z.infer<typeof chapterSchema>;

export const predictChapters = {
  name: "predictChapters",
  description: "The tool to predict an array of chapters, given the context.",
  parameters: zodToJsonSchema(chapterSchema),
};
