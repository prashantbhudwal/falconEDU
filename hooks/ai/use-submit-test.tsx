"use client";
import { ToolData } from "@/app/dragon/ai/student-chat/route";
import { submitTestModalAtom } from "@/lib/atoms/ui";
import { JSONValue } from "ai";
import { useSetAtom } from "jotai";
import useDeepCompareEffect from "use-deep-compare-effect";
import { SubmitTestResult } from "@/app/dragon/ai/student-chat/tools/toolkit/test-submission-tool";

export const useSubmitTest = ({
  data,
  isLoading,
}: {
  data: JSONValue[] | undefined;
  isLoading: boolean;
}) => {
  const setShowSubmitModal = useSetAtom(submitTestModalAtom);
  useDeepCompareEffect(() => {
    let toolData: ToolData[];
    if (data && !isLoading) {
      toolData = JSON.parse(JSON.stringify(data)) as ToolData[];
      const submitTool = toolData.find(
        (tool) => tool.function_name === "submit_test",
      );
      if (submitTool) {
        if (submitTool.tool_call_result.submitTest.submit === true) {
          setShowSubmitModal(true);
        }
      }
    }
  }, [isLoading, setShowSubmitModal, data]);
};
