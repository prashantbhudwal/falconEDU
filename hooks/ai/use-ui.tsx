"use client";
import { ToolData } from "@/app/dragon/ai/student-chat/route";
import {
  showVideoModalAtom,
  submitTestModalAtom,
  videoUrlAtom,
} from "@/lib/atoms/ui";
import { JSONValue } from "ai";
import { useSetAtom } from "jotai";
import useDeepCompareEffect from "use-deep-compare-effect";
import { SubmitTestResult } from "@/app/dragon/ai/student-chat/tools/toolkit/test-submission-tool";

export const useUI = ({
  data,
  isLoading,
}: {
  data: JSONValue[] | undefined;
  isLoading: boolean;
}) => {
  const setShowSubmitModal = useSetAtom(submitTestModalAtom);
  const showVideoModal = useSetAtom(showVideoModalAtom);
  const setVideoUrl = useSetAtom(videoUrlAtom);
  useDeepCompareEffect(() => {
    let toolData: ToolData[];
    if (data && !isLoading) {
      toolData = JSON.parse(JSON.stringify(data)) as ToolData[];
      const submitTool = toolData.find(
        (tool) => tool.function_name === "submit_test",
      );

      const showVideoTool = toolData.find(
        (tool) => tool.function_name === "show_video",
      );

      if (showVideoTool) {
        if (showVideoTool.tool_call_result.video.url.length > 0) {
          console.log(
            showVideoTool.tool_call_result.video.whyIsRightTimeToShow,
          );
          setVideoUrl(showVideoTool.tool_call_result.video.url);
          showVideoModal(true);
        }
      }
      if (submitTool) {
        if (submitTool.tool_call_result.submitTest.submit === true) {
          setShowSubmitModal(true);
        }
      }
    }
  }, [isLoading, setShowSubmitModal, data]);
};
