import { type Message } from "ai";
import { JsonValue } from "@prisma/client/runtime/library";
// Utility function to parse messages from JSON
export function parseMessages(jsonMessages: JsonValue): Message[] {
  if (typeof jsonMessages === "string") {
    try {
      return JSON.parse(jsonMessages);
    } catch (error) {
      console.error("Error parsing messages:", error);
    }
  }
  return [];
}

// Utility function to stringify messages to JSON
export function stringifyMessages(messages: Message[]): string {
  return JSON.stringify(messages);
}
