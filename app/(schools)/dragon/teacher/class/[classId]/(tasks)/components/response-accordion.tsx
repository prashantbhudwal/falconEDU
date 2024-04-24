import { StudentsByBotConfigId } from "@/lib/routers/botConfig";
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
  const numberOfAttempts = allAttempts.length;

  return (
    <div className="relative flex w-[700px] max-w-3xl items-start space-x-6 rounded-md border bg-base-200">
      <Accordion
        type="single"
        defaultValue={!canReattempt ? "item-1" : undefined}
        collapsible
        className="my-3 w-full cursor-pointer border border-base-200 p-3 text-slate-500"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger>
            <div className="flex w-full flex-row items-center justify-between ">
              <div className=" px-4 text-lg text-slate-400">{student.name}</div>
              {canReattempt && numberOfAttempts > 0 ? (
                <span className="text-sm text-slate-500">
                  ({numberOfAttempts} attempts)
                </span>
              ) : null}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2 text-base text-slate-400">
            {allAttempts.map((attempt) => (
              <AttemptCard
                key={attempt.botId}
                className={className}
                student={student}
                type={type}
                taskId={taskId}
                classId={classId}
                attempt={attempt}
                canReattempt={newCanReattempt}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
