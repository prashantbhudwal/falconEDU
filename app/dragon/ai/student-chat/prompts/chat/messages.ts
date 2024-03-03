import { getEngineeredMessagesForChat } from "./template";
import { getFormattedGrade } from "@/lib/helpers";
import { ChatContext } from "@/lib/routers/contextRouter/queries";

export async function getEngineeredChatBotMessages(context: ChatContext) {
  const unformattedGrade = context?.grade;
  const grade = unformattedGrade
    ? getFormattedGrade({ grade: unformattedGrade })
    : "Grade %";

  const engineeredMessages = getEngineeredMessagesForChat({
    teacherName: context.teacherName,
    studentName: context.studentName,
    grade: grade,
    instructions: context.botPreferences.instructions,
    name: context.name,
    mediumOfInstruction: context.botPreferences.mediumOfInstruction,
    hasEquations: context.botPreferences.hasEquations,
  });
  return { engineeredMessages };
}
