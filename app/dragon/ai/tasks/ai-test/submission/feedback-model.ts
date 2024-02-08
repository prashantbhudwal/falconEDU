import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { OPENAI_MODEL } from "../../../config";

export const studentFeedbackObjectSchema = z.object({
  feedback: z
    .string()
    .describe("Feedback for the student based on the report."),
});

export const giveFeedback = {
  name: "giveFeedback",
  description:
    "Provide the feedback to the student based on the report given to you.",
  parameters: zodToJsonSchema(studentFeedbackObjectSchema),
};

export const baseModel = new ChatOpenAI({
  modelName: OPENAI_MODEL.GPT3,
  temperature: 1,
});

export const giveFeedbackModel = baseModel.bind({
  functions: [giveFeedback],
  function_call: { name: "giveFeedback" },
});
