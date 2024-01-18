import * as z from "zod";
import { createToolWithCallback } from "../utils";

export async function submitTestCallback(submit: boolean) {
  console.log("Test submitted", submit);
  return "Test submitted";
}

const schema = z.object({
  submit: z.boolean().describe("Whether to submit the test now"),
});

export const submitTest = createToolWithCallback({
  name: "submit_test",
  description:
    "You will use this function to submit the test when you have decided that all the content inside the <content> has been covered in the question and answering session with the student.",
  schema,
  callback: submitTestCallback,
  type: "function",
});
