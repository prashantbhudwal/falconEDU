import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { agentSchema } from "../agentSchema";

const defaultValues: z.infer<typeof agentSchema> = {
  teacherIntro: "",
  tone: "Friendly",
  responseTime: "Instant",
  subjects: [],
  languagePreferences: [],
  feedbackLoop: false,
  humorLevel: "High",
  customPhrases: [],
  personalInterests: [],
  motivation: "",
  lifeExperience: [],
  culturalBackground: "",
  emojiUse: "Often",
  preferredExamples: "Real-world",
  debateTolerance: "Encouraged",
  targetGradeLevels: [],
  targetBoards: [],
  targetCourseTypes: [],
  studentTechComfort: "Beginner",
  parentInvolvement: "High",
};

export default function useAgentForm() {
  const onSubmit = (data: z.infer<typeof agentSchema>) => {
    console.log(data);
  };
  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues,
  });
  return { form, onSubmit };
}
