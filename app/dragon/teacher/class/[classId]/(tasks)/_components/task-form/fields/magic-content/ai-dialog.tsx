import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import { Button } from "@/components/ui/button";
import { AIMarkdown } from "@/components/chat/ai-markdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Grade } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { baseTaskSchema } from "@/lib/schema";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { useCompletion } from "ai/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ContentAPIRequestBody } from "@/app/dragon/ai/content/route";
import { cn } from "@/lib/utils";
import { TaskType } from "@/types";

type formType = z.infer<typeof baseTaskSchema>;

export const AIDialog = ({
  onAccept,
  open,
  setOpen,
  classId,
  grade,
  type,
}: {
  onAccept: (content: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  classId: string;
  grade: Grade;
  type: TaskType;
}) => {
  const [parentRef] = useAutoAnimate();
  const [generatedContent, setGeneratedContent] = useState("");
  const form = useFormContext<formType>();
  const topic = form.getValues("topic");
  const subjects = form.getValues("subjects");
  const formattedSubjects =
    subjects.length === 1 ? subjects[0] : subjects.join(", ");
  const formattedGrade = getFormattedGrade({ grade });

  const requestBody: Omit<ContentAPIRequestBody, "prompt"> = {
    isFirstGeneration: generatedContent.length === 0,
    topic: topic,
    subjects: subjects,
    grade: grade,
    type: type,
    lastGeneratedContent: generatedContent,
  };

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    complete,
  } = useCompletion({
    api: "/dragon/ai/content",
    body: requestBody,
    onFinish(prompt, completion) {
      setGeneratedContent(completion);
    },
  });

  const hasContent = completion.length > 0 || generatedContent.length > 0;
  const content = isLoading ? completion : generatedContent;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid h-5/6 max-w-5xl grid-cols-6 grid-rows-12">
        <DialogHeader className="col-span-6 flex flex-row items-center justify-between p-5 ">
          <div className="flex flex-col space-y-2">
            <DialogTitle>{topic}</DialogTitle>
            <DialogDescription className="flex items-center space-x-2">
              <div>{formattedGrade}</div>
              <Separator orientation="vertical" className="h-2" />
              <div>{formattedSubjects}</div>
            </DialogDescription>
          </div>
          <div ref={parentRef}>
            {hasContent ? (
              <div className="group relative">
                <div
                  className={cn({
                    "absolute left-0 top-0 h-full w-full animate-ping bg-accent/50 blur-md repeat-1 group-hover:bg-transparent":
                      !isLoading,
                  })}
                ></div>
                <Button
                  variant="secondary"
                  color="secondary"
                  size={"lg"}
                  onClick={() => onAccept(generatedContent)}
                  className="drop-shadow-md"
                  disabled={isLoading}
                >
                  Use Content
                </Button>
              </div>
            ) : (
              <Button
                variant={"default"}
                color={"primary"}
                size={"lg"}
                onClick={() => complete("")} // Since no prompt is needed for the first generation, we can pass an empty string
              >
                Generate
              </Button>
            )}
          </div>
        </DialogHeader>
        <main className="col-span-6 row-start-3 row-end-11">
          <Card className="h-full overflow-y-auto">
            <CardContent className=" py-2">
              <AIMarkdown content={content} />
            </CardContent>
          </Card>
        </main>
        <footer className="col-span-6 row-start-11 row-end-12 w-full">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex items-center space-x-3 "
          >
            <Input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="How would you like to change it?"
              className="w-full"
            />
            <Button
              variant={"outline"}
              color={"primary"}
              type="submit"
              size={"default"}
            >
              Modify
            </Button>
          </form>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
