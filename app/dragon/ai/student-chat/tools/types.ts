import { ChatCompletionTool } from "openai/resources";
import { JsonSchema7Type } from "zod-to-json-schema";

export type toolName = "search_youtube_video" | "test-submission-tool";

export type CustomJsonSchema = JsonSchema7Type & {
  $schema?: string | undefined;
  additionalProperties?: boolean;
};

export type FunctionDefinition = {
  name: toolName;
  description: string;
  parameters: CustomJsonSchema;
};

export type ToolWithCallback = {
  name: toolName;
  tool: ChatCompletionTool;
  callback: Function;
};
