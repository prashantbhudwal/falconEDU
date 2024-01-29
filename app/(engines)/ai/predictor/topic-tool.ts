import * as Z from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const topicSchema = Z.object({
  topicsArray: Z.array(
    Z.string().describe("The array of topics for a given chapter"),
  ),
}).describe("The object containing the array of topics for a given chapter");

export type PredictTopicsObject = Z.infer<typeof topicSchema>;

export const predictTopics = {
  name: "predictTopics",
  description:
    "The tool to predict an array of topics for a given chapter, given the context.",
  parameters: zodToJsonSchema(topicSchema),
};
