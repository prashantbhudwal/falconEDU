"use server";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";
import { ChatPromptTemplate } from "langchain/prompts";
import {
  systemTemplateForChapterPrediction,
  systemTemplateForTopicPrediction,
} from "./templates";
import { chapterPredictionModel, topicPredictionModel } from "./model";
import { chapterSchema } from "./chapter-tool";
import { topicSchema } from "./topic-tool";

export async function predictChapters({
  grade,
  subject,
  board,
}: {
  grade: string;
  subject: string;
  board: string;
}): Promise<string[]> {
  try {
    const jsonOutputParser = new JsonOutputFunctionsParser();

    const promptForChapterPrediction = ChatPromptTemplate.fromMessages([
      ["system", systemTemplateForChapterPrediction],
    ]);

    const chapterPredictionChain = promptForChapterPrediction
      .pipe(chapterPredictionModel)
      .pipe(jsonOutputParser);

    const chapterPrediction = await chapterPredictionChain.invoke({
      grade: grade,
      subject: subject,
      board: board,
    });
    //console.log(chapterPrediction);

    const parsedChapterPrediction = chapterSchema.safeParse(chapterPrediction);
    //console.log(parsedChapterPrediction);

    if (!parsedChapterPrediction.success) {
      throw new Error("Error parsing chapter prediction");
    }
    //console.log(parsedChapterPrediction.data.chaptersArray);

    return parsedChapterPrediction.data.chaptersArray;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function predictTopics({
  grade,
  subject,
  board,
  chapter,
}: {
  grade: string;
  subject: string;
  board: string;
  chapter: string;
}): Promise<string[]> {
  try {
    const jsonOutputParser = new JsonOutputFunctionsParser();

    const promptForTopicPrediction = ChatPromptTemplate.fromMessages([
      ["system", systemTemplateForTopicPrediction],
    ]);

    const topicPredictionChain = promptForTopicPrediction
      .pipe(topicPredictionModel)
      .pipe(jsonOutputParser);

    const topicPrediction = await topicPredictionChain.invoke({
      grade: grade,
      subject: subject,
      board: board,
      chapter: chapter,
    });

    const parsedTopicPrediction = topicSchema.safeParse(topicPrediction);

    if (!parsedTopicPrediction.success) {
      throw new Error("Error parsing topic prediction");
    }

    return parsedTopicPrediction.data.topicsArray;
  } catch (err) {
    return [];
    console.error(err);
  }
}
