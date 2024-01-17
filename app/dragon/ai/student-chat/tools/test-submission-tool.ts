export const submitTestTool = {
  name: "submit_test",
  description:
    "You will use this function to submit the test when you have decided that all the content inside the <content> has been covered in the question and answering session with the student.",
  parameters: {
    type: "object",
    properties: {
      submit: {
        type: "boolean",
        description: "Whether to submit the test now",
      },
    },
    required: ["submit"],
  },
};

export async function submitTest(submit: boolean) {
  console.log("Test submitted", submit);
  return "Test submitted";
}
