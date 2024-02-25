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
import { magicContentSuggestions } from "./suggestions";
import { AIMagicIcon, LeftArrowIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/icon-button";

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

  const isFirstGeneration = generatedContent.length === 0;
  const noTopic = topic.length === 0;
  const noSubjects = subjects.length == 0 || subjects[0].length === 0;

  const notAllowed = noTopic || noSubjects;

  const requestBody: Omit<ContentAPIRequestBody, "prompt"> = {
    isFirstGeneration: isFirstGeneration,
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
    setInput,
    handleInputChange,
    handleSubmit,
    complete,
  } = useCompletion({
    api: "/dragon/ai/content",
    body: requestBody,
    onFinish(prompt, completion) {
      setGeneratedContent(completion);
      setInput("");
    },
  });

  const hasContent = completion.length > 0 || generatedContent.length > 0;
  const content = isLoading ? completion : generatedContent;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid h-5/6 max-w-5xl grid-cols-6 grid-rows-12">
        <DialogHeader className="col-span-6 flex flex-row items-center justify-between p-5 ">
          <div className="flex flex-col space-y-2">
            <DialogTitle
              className={cn("text-2xl font-bold", {
                "text-warning": noTopic,
              })}
            >
              {noTopic ? "You haven't added a topic" : topic}
            </DialogTitle>
            <DialogDescription className="flex items-center space-x-2">
              <div>{formattedGrade}</div>
              <Separator orientation="vertical" className="h-2" />
              <div
                className={cn({
                  "text-warning": noSubjects,
                })}
              >
                {noSubjects
                  ? "You haven't added any subjects"
                  : formattedSubjects}
              </div>
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
                  onClick={() => onAccept(generatedContent)}
                  className="drop-shadow-md"
                  disabled={isLoading}
                  type="button"
                >
                  Use Content
                </Button>
              </div>
            ) : (
              <IconButton
                icon={
                  notAllowed ? (
                    <LeftArrowIcon size="xs" />
                  ) : (
                    <AIMagicIcon size="xs" />
                  )
                }
                variant={"default"}
                color={"primary"}
                size={"lg"}
                onClick={() => complete("")} // Since no prompt is needed for the first generation, we can pass an empty string
                type="button"
                disabled={notAllowed}
              >
                {notAllowed ? "Can't Generate" : "Generate"}
              </IconButton>
            )}
          </div>
        </DialogHeader>
        <main className="col-span-6 row-start-3 row-end-11">
          <Card
            className={cn("h-full overflow-y-auto", {
              "animate-pulse ring-1 ring-primary": isLoading,
            })}
          >
            <CardContent className={cn("py-2")}>
              <AIMarkdown content={content} />
            </CardContent>
          </Card>
        </main>
        {!isFirstGeneration && (
          <footer
            ref={parentRef}
            className="col-span-6 row-start-11 row-end-13 flex w-full flex-col space-y-2 "
          >
            <div className="flex flex-row flex-wrap space-x-3">
              {magicContentSuggestions.map((suggestion) => (
                <Button
                  onClick={() => complete(suggestion.prompt)}
                  key={suggestion.keyword}
                  variant={"outline"}
                  size={"sm"}
                  className="w-fit whitespace-nowrap"
                  type="button"
                >
                  {suggestion.suggestion}
                </Button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.stopPropagation(); // Prevent event from bubbling up
                handleSubmit(event);
              }}
              className="flex items-center space-x-3 "
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
                disabled={isLoading}
                className="border-info text-info"
                size={"sm"}
              >
                Modify
              </Button>
            </form>
          </footer>
        )}
      </DialogContent>
    </Dialog>
  );
};
