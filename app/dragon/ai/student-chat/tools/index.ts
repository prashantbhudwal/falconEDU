import { TaskType } from "@/types";
import { ToolWithCallback, toolName } from "./types";
import { youtubeSearch } from "./toolkit/youtube-search-tool";
import { submitTest } from "./toolkit/test-submission-tool";

// All tools that are available for each task type
const taskToolMap: Record<TaskType, ToolWithCallback[]> = {
  chat: [],
  test: [],
  lesson: [youtubeSearch],
  "ai-test": [submitTest],
};

const allTools = Object.values(taskToolMap).flat();

export function findToolByName(name: toolName): ToolWithCallback | undefined {
  return allTools.find((tool) => tool.name === name);
}

type ToolsAndToolsWithCallback = {
  tools: ToolWithCallback["tool"][] | undefined;
  toolsWithCallback: ToolWithCallback[] | undefined;
};

export function findToolsByTask(type: TaskType): ToolsAndToolsWithCallback {
  const toolsWithCallback = taskToolMap[type];
  const tools = taskToolMap[type].map((tool) => tool.tool);

  return {
    tools: tools.length === 0 ? undefined : tools,
    toolsWithCallback:
      toolsWithCallback.length === 0 ? undefined : toolsWithCallback,
  };
}
