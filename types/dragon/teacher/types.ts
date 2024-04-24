import { questionTypes } from "../../../app/(schools)/dragon/ai/test-checker/tool"; // Find a way to type check question type with prisma

export type UpdatedQuestionType = Exclude<
  (typeof questionTypes)[number],
  "OBJECTIVE_MATCH_THE_FOLLOWING" | "SUBJECTIVE_ESSAY"
>;
