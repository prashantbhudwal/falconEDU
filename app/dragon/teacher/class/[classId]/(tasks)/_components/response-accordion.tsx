import { StudentsByBotConfigId } from "../[taskId]/test/queries";
import { TaskType } from "@/types/dragon";
import { ResponseCard } from "./response-card";
import { db } from "@/app/dragon/teacher/routers";
import { AttemptCard } from "./attempt-card";

type ResponseProps = {
  className?: string;
  student: StudentsByBotConfigId["students"][0];
  type: TaskType;
  canReattempt: boolean | undefined;
  taskId: string;
  classId: string;
};
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";

export const Response = async function ({
  className,
  student,
  type,
  canReattempt,
  taskId,
  classId,
}: ResponseProps) {
  const allAttempts = await db.botConfig.getAllBotChats({
    studentBotId: student.studentBotId,
  });

  return (
    <div className="w-[700px] bg-base-200 max-w-3xl flex items-start space-x-6 rounded-md relative my-1 border border-base-200">
      {canReattempt ? (
        <Accordion
          type="single"
          collapsible
          className="my-3 p-3 text-text-500 cursor-pointer border border-base-200 w-full"
        >
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-lg px-4 text-text-400">
              {student.name}
            </AccordionTrigger>
            <AccordionContent className="pl-2 text-text-400 text-base">
              {allAttempts
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((attempt) => (
                  <AttemptCard
                    key={attempt.botId}
                    className={className}
                    student={student}
                    type={type}
                    taskId={taskId}
                    classId={classId}
                    attemptNumber={attempt.attemptNumber}
                    attemptSubmitted={attempt.isSubmitted}
                  />
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <ResponseCard
          className={className}
          student={student}
          type={type}
          canReattempt={canReattempt}
          taskId={taskId}
          classId={classId}
        />
      )}
    </div>
  );
};
