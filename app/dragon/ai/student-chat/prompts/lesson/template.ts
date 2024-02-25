import { videoArraySchema } from "@/lib/schema";
import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";
import {
  EMOJI_DIRECTIVE,
  ONE_PARAGRAPH_DIRECTIVE_SYSTEM,
  ONE_PARAGRAPH_DIRECTIVE_USER,
  HINDI_DIRECTIVE,
  getResponseFormatDirective,
} from "../common/directives";
import endent from "endent";
import { replyInHindi } from "../common/student-messages";
import z from "zod";
type videoType = z.infer<typeof videoArraySchema>;
type NullableString = string | undefined | null;
type engineeredMessagesForLesson = {
  teacherName: NullableString;
  studentName: NullableString;
  topic: string;
  content: string;
  aboutYourself: string | undefined;
  favoriteCartoons: string | undefined;
  favoriteFoods: string | undefined;
  interests: string | undefined;
  humorLevel: string;
  language: string;
  languageProficiency: string;
  tone: string;
  subjects: string;
  grade: string;
  personalInformation: string | undefined;
  professionalInformation: string | undefined;
  likes: string | undefined;
  dislikes: string | undefined;
  mediumOfInstruction: string | undefined;
  videos: videoType;
  hasEquations: boolean | undefined;
};

type TeacherPersona = Pick<
  engineeredMessagesForLesson,
  | "teacherName"
  | "personalInformation"
  | "professionalInformation"
  | "likes"
  | "dislikes"
>;

type StudentPersona = Pick<
  engineeredMessagesForLesson,
  | "studentName"
  | "aboutYourself"
  | "favoriteCartoons"
  | "favoriteFoods"
  | "interests"
>;

const getStudentPersonaUserMessage = function ({
  studentName,
  aboutYourself,
  favoriteCartoons,
  favoriteFoods,
  interests,
}: StudentPersona): string {
  const studentNameSentence = studentName ? `My name is ${studentName}. ` : "";
  const aboutYourselfSentence =
    aboutYourself && aboutYourself?.length > 0
      ? `Here is a bit more about me: ${aboutYourself}. `
      : "";
  const favoriteCartoonsSentence = favoriteCartoons
    ? `Here are my favorite cartoons: ${favoriteCartoons}. `
    : "";

  const favoriteFoodsSentence = favoriteFoods
    ? `I love eating: ${favoriteFoods}. `
    : "";

  const interestsSentence = interests
    ? `I am interested in: ${interests}. `
    : "";

  const studentPersona = endent`${studentNameSentence}${aboutYourselfSentence}${favoriteCartoonsSentence}${favoriteFoodsSentence}${interestsSentence}`;

  return studentPersona;
};

const getStudentPersonaSystemMessage = function ({
  studentName,
  aboutYourself,
  favoriteCartoons,
  favoriteFoods,
  interests,
}: StudentPersona): {
  studentPersonaSystemDirective: string;
  studentPersonaSystemPrompt: string;
} {
  const studentNameSentence = studentName ? `Name: '''${studentName}'''` : "";
  const aboutYourselfSentence =
    aboutYourself && aboutYourself?.length > 0
      ? `- About me: '''${aboutYourself}'''. `
      : "";
  const favoriteCartoonsSentence = favoriteCartoons
    ? `- Favorite cartoons: '''${favoriteCartoons}'''. `
    : "";

  const favoriteFoodsSentence = favoriteFoods
    ? `- Favorite foods: '''${favoriteFoods}'''. `
    : "";

  const interestsSentence = interests
    ? `- Interests: '''${interests}'''. `
    : "";

  const studentPersonaSystemPrompt = endent`
  ## '''STUDENT PERSONA STARTS HERE'''
  ${studentNameSentence}
  ${aboutYourselfSentence}
  ${favoriteCartoonsSentence}
  ${favoriteFoodsSentence}
  ${interestsSentence}
  '''STUDENT PERSONA ENDS HERE'''
  `;

  const studentPersonaSystemDirective = endent`The information about he student is given in the '''STUDENT PERSONA''' section. You can use this information to make your teaching more personal and effective.`;

  return { studentPersonaSystemDirective, studentPersonaSystemPrompt };
};

const getTeacherPersonaSystemMessage = function ({
  teacherName,
  personalInformation,
  professionalInformation,
  likes,
  dislikes,
}: TeacherPersona): string {
  const teacherNameSentence = teacherName ? `Name: '''${teacherName}'''` : "";
  const personalInformationSentence = personalInformation
    ? `- Personal Information: '''${personalInformation}'''. `
    : "";
  const professionalInformationSentence = professionalInformation
    ? `- Professional Information: '''${professionalInformation}'''. `
    : "";
  const likesSentence = likes ? `- Likes: '''${likes}'''. ` : "";
  const dislikesSentence = dislikes ? `- Dislikes: '''${dislikes}'''. ` : "";

  const teacherPersona = endent`
  ${teacherNameSentence}
  ${personalInformationSentence}
  ${professionalInformationSentence}
  ${likesSentence}
  ${dislikesSentence}
  `;

  return teacherPersona;
};

const getVideoDirectiveAndPrompts = function ({
  videos,
}: {
  videos: videoType;
}): { videoDirective: string; videoPrompt: string } {
  const hasVideos = videos && videos.length > 0;

  const videoDirective = hasVideos
    ? endent`# You also have """VIDEOS""" that you can use to teach th lesson. Intertwine the videos with the lesson. Don't show all the videos at once. Show them one by one, when appropriate.`
    : "";

  const videoPrompts = hasVideos
    ? videos.map(({ title, url, metadata }) => {
        let prompt = `Video: ${title}\nURL: ${url}`;
        if (metadata) {
          prompt += `\nDescription: ${metadata}`;
        }
        return prompt;
      })
    : [];
  const videoPrompt = hasVideos
    ? endent`Format: [<Title>](<URL>)
  Videos:
  ${videoPrompts.join("\n")}`
    : "";

  return { videoDirective, videoPrompt };
};

export const getEngineeredMessagesForLesson = ({
  teacherName,
  studentName,
  topic,
  content,
  aboutYourself,
  favoriteCartoons,
  favoriteFoods,
  interests,
  humorLevel,
  language,
  languageProficiency,
  tone,
  subjects,
  grade,
  personalInformation,
  professionalInformation,
  likes,
  dislikes,
  mediumOfInstruction,
  videos,
  hasEquations,
}: engineeredMessagesForLesson): ChatCompletionMessageParam[] => {
  const teacherPersona = getTeacherPersonaSystemMessage({
    teacherName,
    personalInformation,
    professionalInformation,
    likes,
    dislikes,
  });

  const studentPersona = getStudentPersonaUserMessage({
    studentName,
    aboutYourself,
    favoriteCartoons,
    favoriteFoods,
    interests,
  });

  const medium = mediumOfInstruction ?? "english";

  const { videoDirective, videoPrompt } = getVideoDirectiveAndPrompts({
    videos,
  });

  const RESPONSE_FORMAT_DIRECTIVE = getResponseFormatDirective({
    hasEquations,
  });

  const SYSTEM = endent`
${medium === "hindi" ? HINDI_DIRECTIVE : ""}
# Your name is ${teacherName} and you are a teacher. Your job is to teach a '''LESSON'''. The source of truth for "what to teach" is the '''LESSON CONTENT''' section. Adapt the '''LESSON CONTENT''' to the '''PEDAGOGICAL CONTEXT''' and teach it to the student. Don't give all the information at once. Give the information in parts. Ask questions to check understanding. Give feedback. Follow the socratic method of teaching.
${videoDirective}
${RESPONSE_FORMAT_DIRECTIVE}
## Always teach according to the '''PEDAGOGICAL CONTEXT'''.
${EMOJI_DIRECTIVE}
## NEVER answer non-educational questions or grade inappropriate questions.
## Always follow the '''INSTRUCTIONS''' given in this message.
## Always stick to the '''TEACHER PERSONA''' given in the message. 
## Always Adhere to the the '''DO's''' and '''DON'Ts'''.

---
VIDEO LINK FORMAT: Always show with link, thumbnail and title.
___
## '''TEACHER PERSONA''' STARTS HERE
${teacherPersona}
## '''TEACHER PERSONA''' ENDS HERE
---



'''LESSON CONTENT STARTS HERE''' 
## Medium of Instruction: '''${mediumOfInstruction}'''
## Lesson Topic: '''${topic}'''
<MostImportantInformationForTheLesson>
## Lesson Content: 
'''${content}'''
</MostImportantInformationForTheLesson>
'''LESSON CONTENT ENDS HERE'''

${
  videoPrompt.length > 0 &&
  endent`
---
'''VIDEOS START HERE'''
${videoPrompt}
'''VIDEOS END HERE'''
`
}

---
## '''PEDAGOGICAL CONTEXT''' STARTS HERE 
use this to teach {studentName} and decide what and how to teach them and what is appropriate for them to learn.
- You teach the lesson in parts.
- You never teach the whole lesson at once.
- You ask questions to the student to check their understanding.
- You never ask more than one question at a time.
- You give feedback to the student.
- You follow the socratic method of teaching.
- Your humor level is: '''${humorLevel}'''. 
- You speak '''${language}''' with ''${languageProficiency}''' proficiency.
- Your tone while teaching should be '''${tone}''.
- Subjects: ${subjects}. 
- Grade Level: ${grade}. 
'''PEDAGOGICAL CONTEXT''' ENDS HERE
---
## '''DO's''' 
    - ONLY answer question about ${subjects}. You are not an expert in other subjects. DON'T answer questions about other subjects.

## '''DON'Ts'''
    - NEVER mention that you are a bot or an AI. You are just a teacher.
    - NEVER mention OpenAI.
    - NEVER say "As a teacher" or "As a bot" or "As an AI assistant". Talk like you are a ${teacherName}. Instead of saying "As a teacher, I think you should do this", say "I think you should do this".

## The AI you use to teach was made by FalconAI aka. Falcon AI(www.falconai.in).

${ONE_PARAGRAPH_DIRECTIVE_SYSTEM}
  `;
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: SYSTEM,
    },
    {
      role: "user",
      content: studentPersona,
    },
    {
      role: "assistant",
      content: "Nice to meet you. I am ready to teach you.",
    },
  ];

  const defaultUserMessage: ChatCompletionUserMessageParam = {
    role: "user",
    content: endent`Always remember to follow your instructions. Most importantly remember that you are teaching this lesson: '''${topic}.''' Keep your responses concise and simple to understand. You already know my PERSONA, can you use that to make your teaching more personal and effective? Maybe you can use my PERSONA tp personalize examples, analogies, stories, etc. for me. I am excited to learn from you. I am ready for the lesson. ${ONE_PARAGRAPH_DIRECTIVE_USER}`,
  };

  medium === "hindi"
    ? messages.push(replyInHindi)
    : messages.push(defaultUserMessage);
  return messages;
};
