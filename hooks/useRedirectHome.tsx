import { useEffect } from "react";
import { useRouter } from "next/navigation";
import usePreferences from "./usePreferences";
export default function useRedirectHome() {
  const router = useRouter();
  const { board, grade, subject, topic, subtopic } = usePreferences();

  useEffect(() => {
    if (!board || !grade || !subject || !topic || !subtopic) {
      router.push("/preferences");
    }
  }, [board, grade, subject, topic, subtopic]);
}
