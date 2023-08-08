import { useEffect } from "react";
import { useRouter } from "next/navigation";
import usePreferences from "./usePreferences";
export default function useRedirectHome() {
  const router = useRouter();
  const { board, grade, subject, topic, worksheetSubtopics } = usePreferences();

  useEffect(() => {
    if (
      !board ||
      !grade ||
      !subject ||
      !topic ||
      worksheetSubtopics.length === 0
    ) {
      router.push("/preferences");
    }
  }, [board, grade, subject, topic, worksheetSubtopics]);
}
