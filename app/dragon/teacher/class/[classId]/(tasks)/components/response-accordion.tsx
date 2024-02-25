import { StudentsByBotConfigId } from "../[taskId]/test/queries";
import { TaskType } from "@/types/dragon";
import { ResponseCard } from "./response-card";
import { db } from "@/lib/routers";
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
  const newCanReattempt = false;
  const allAttempts = await db.botConfig.getAllBotChats({
    studentBotId: student.studentBotId,
  });

  return (
    <div className="relative my-1 flex w-[700px] max-w-3xl items-start space-x-6 rounded-md border border-base-200 bg-base-200">
      <Accordion
        type="single"
        collapsible
        className="my-3 w-full cursor-pointer border border-base-200 p-3 text-slate-500"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="px-4 text-lg text-slate-400">
            {student.name}
          </AccordionTrigger>
          <AccordionContent className="pl-2 text-base text-slate-400">
            {allAttempts
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((attempt) => (
                <AttemptCard
                  attemptId={attempt.id}
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
    </div>
  );
};
