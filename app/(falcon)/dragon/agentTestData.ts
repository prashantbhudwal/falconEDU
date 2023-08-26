export const agentData = {
  id: "111",
  userId: "1234",
  name: "John Doe",
  email: "",
  grade: "Grade 3",
  subjects: ["Math", "Science"],
  curriculum: "CBSE",
  config: {},
};

export const agentDataArray = [
  agentData,
  { ...agentData, id: "222" },
  { ...agentData, id: "333" },
];

export type AgentTestData = typeof agentData;
