import zodToJsonSchema from "zod-to-json-schema";
import {
  CustomJsonSchema,
  FunctionDefinition,
  ToolWithCallback,
  toolName,
} from "./types";
import { z } from "zod";

export const zodSchemaToOpenAIParameters = (zodSchema: z.ZodSchema<any>) => {
  const jsonSchema = zodToJsonSchema(zodSchema);
  // Removing $schema and additionalProperties from the schema to save tokens
  const { $schema, additionalProperties, ...parameters } =
    jsonSchema as CustomJsonSchema;
  return parameters;
};

export const createToolWithCallback = function ({
  name,
  description,
  schema,
  callback,
  type = "function",
}: {
  name: toolName;
  description: string;
  schema: z.ZodSchema<any>;
  callback: Function;
  type: "function";
}): ToolWithCallback {
  const functionDefinition: FunctionDefinition = {
    name,
    description,
    parameters: zodSchemaToOpenAIParameters(schema),
  };
  return {
    name,
    tool: {
      type: type,
      function: functionDefinition,
    },
    callback,
  };
};
