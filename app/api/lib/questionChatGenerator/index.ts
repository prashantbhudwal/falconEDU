import { QuestionItem, QuestionPayload, QuestionType } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
const bloomLevels = [
  {
    level: "Remember",
    keywords: [
      "List",
      "Define",
      "Describe",
      "Identify",
      "Show",
      "Label",
      "Collect",
      "Examine",
      "Tabulate",
      "Quote",
      "Name",
      "Who",
      "When",
      "Where",
      "What",
    ],
  },
  {
    level: "Understand",
    keywords: [
      "Interpret",
      "Summarize",
      "Discuss",
      "Describe",
      "Explain",
      "Identify",
      "Retell",
      "Research",
      "Compare",
      "Differentiate",
      "Demonstrate",
      "Express",
      "Locate",
      "Report",
      "Recognize",
      "Tell",
      "Illustrate",
      "Indicate",
      "Find",
    ],
  },
  {
    level: "Apply",
    keywords: [
      "Solve",
      "Show",
      "Use",
      "Illustrate",
      "Construct",
      "Complete",
      "Examine",
      "Classify",
      "Do",
      "Experiment with",
      "Dramatize",
      "Apply",
      "Demonstrate",
      "Change",
      "Compute",
      "Discover",
      "Manipulate",
      "Prepare",
      "Produce",
      "Predict",
      "Operate",
      "Interpret",
      "Practice",
    ],
  },
  {
    level: "Analyze",
    keywords: [
      "Analyze",
      "Distinguish",
      "Examine",
      "Compare",
      "Contrast",
      "Investigate",
      "Categorize",
      "Identify",
      "Explain",
      "Separate",
      "Advertise",
      "Appraise",
      "Calculate",
      "Experiment",
      "Test",
      "Detect",
      "Diagram",
      "Inspect",
      "Debate",
      "Inventory",
      "Question",
      "Inquire",
      "Survey",
      "Test for",
      "Classify",
      "Investigate",
    ],
  },
  {
    level: "Evaluate",
    keywords: [
      "Judge",
      "Recommend",
      "Critique",
      "Justify",
      "Appraise",
      "Argue",
      "Defend",
      "Select",
      "Evaluate",
      "Rate",
      "Measure",
      "Value",
      "Revise",
      "Score",
      "Choose",
      "Decide",
      "Assess",
      "Estimate",
      "Validate",
      "Consider",
      "Compare",
      "Convince",
      "Judge",
      "Conclude",
      "Critique",
      "Relate",
      "Predict",
    ],
  },
  {
    level: "Create",
    keywords: [
      "Create",
      "Invent",
      "Compose",
      "Predict",
      "Plan",
      "Construct",
      "Design",
      "Imagine",
      "Propose",
      "Devise",
      "Formulate",
      "Prepare",
      "Develop",
      "Assemble",
      "Collect",
      "Create",
      "Set up",
      "Organize",
      "Manage",
      "Write",
    ],
  },
];
const JSON_DIRECTIVE = "Only respond with JSON.";
function getQuestionTypePrompt(questionType: string) {
  switch (questionType) {
    case "fillInTheBlanks":
      return "Design a fill-in-the-blank question within a specified academic topic. Your question should involve a sentence, paragraph, or passage with an intentional blank where a key term, event, or concept should be inserted by the student. Make sure the question evaluates the student's comprehension and knowledge of the topic. The missing information should be crucial enough that its inclusion or exclusion alters the understanding or interpretation of the topic.";
    case "multipleChoiceSingleCorrect":
      return "Create a multiple choice question within a given academic topic. The question should have multiple plausible options, but only one correct answer. Ensure the options are structured to assess the student's understanding and knowledge of the topic.";
    case "trueFalse":
      return "Craft a declarative statement related to a chosen academic topic that can be judged as either true or false. The statement should be clear, unambiguous, and designed to test the student's understanding and knowledge of the topic.";
    case "shortAnswer":
      return "Create a short-answer question related to a specified academic topic. The question should be open-ended, encouraging the student to express their understanding and knowledge of the topic in their own words.";
    case "essay":
      return "Develop an essay prompt within a specified academic topic. The prompt should encourage deep thinking and extensive elaboration on the topic, allowing the student to demonstrate their understanding, knowledge, and ability to construct and support an argument.";
    case "project":
      return "Create a project based task related to a specific academic topic.";
    case "debate":
      return "Design a debate topic within a chosen academic topic. The debate topic should be controversial enough to have two distinct sides.";
    case "brainstorming":
      return "Formulate a topic for a brainstorming session within a certain academic topic. The topic should be broad and challenging enough to allow for diverse ideas and creative thinking.";
    case "groupDiscussion":
      return "Generate a discussion topic within a specific academic domain. The topic should provoke thought and facilitate meaningful dialogue among students, encouraging them to share, listen, and build upon ideas.";
    default:
      throw new Error("Invalid question type");
  }
}

function getQuestionResponseFormat(questionType: QuestionType): string {
  switch (questionType) {
    case "trueFalse":
      return `{"type":"trueFalse","question":<question>}`;
    case "fillInTheBlanks":
      return `{"type":"fillInTheBlanks","question":<question>}`;
    case "multipleChoiceSingleCorrect":
      return `{"type":"multipleChoiceSingleCorrect","question":<question>, "options":<options>, "answer":<correctOption>}`;
    case "shortAnswer":
      return `{"type":"shortAnswer","question":<question>}`;
    case "essay":
      return `{"type":"essay","question":<question>}`;
    case "project":
      return `{"type":"project","question":<task>`;
    case "debate":
      return `{"type":"debate","question":<topicForDebate>}`;
    case "brainstorming":
      return `{"type":"brainstorming","question":<topic>}`;
    case "groupDiscussion":
      return `{"type":"groupDiscussion","question":<topic>}`;
    default:
      throw new Error("Invalid question type");
  }
}

function getBloomLevelPrompt(bloomLevel: string | undefined): string {
  const lowerCaseBloomLevel = bloomLevel?.toLowerCase();
  switch (lowerCaseBloomLevel) {
    case "remember":
      return "Remembering";
    case "understand":
      return "Understanding";
    case "apply":
      return "Applying";
    case "analyze":
      return "Analyzing";
    case "evaluate":
      return "Evaluating";
    case "create":
      return "Creating";
    default:
      throw new Error("Invalid bloom level");
  }
}
function getPreviousQuestionsMessage(previousQuestions: QuestionItem[]) {
  const previousQuestionsArray = previousQuestions.map((question) => {
    return question.question;
  });

  const previousQuestionsString = JSON.stringify(previousQuestionsArray);
  if (previousQuestions.length === 0) {
    return "";
  } else {
    return `Make sure that the question is different from the questions previously generated. Previous questions: """${previousQuestionsString}""".`;
  }
}

function getTextbookName(board: string | undefined) {
  switch (board) {
    case "CBSE":
      return "NCERT";
    case "ICSE":
      return "ICSE";
    case "State Board":
      return "State Board";
    default:
      throw new Error("Invalid board");
  }
}

function getSystemMessage(
  payload: QuestionPayload
): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `Generate questions for a school worksheet. ${JSON_DIRECTIVE}`,
    },
  ];
}

function getInitialUserMessage(payload: QuestionPayload): string {
  const previousQuestionsMessage = getPreviousQuestionsMessage(
    payload.generatedQuestions
  );
  const { bloomLevel, topic, subtopic, grade, board, type } = payload.data;
  const prompt_QuestionType = getQuestionTypePrompt(type);
  const prompt_BloomLevel = getBloomLevelPrompt(bloomLevel);
  const questionFormat = getQuestionResponseFormat(type);
  const textbookName = getTextbookName(board);
  return `${prompt_QuestionType} The question should be for the topic "${subtopic}" from the chapter "${topic}". The questions are for students in grade ${grade}. The students follow  """${board}""" curriculum. So, always adhere to the """${textbookName}""" textbook. 
  
  While generating the question, follow """Bloom's taxonomy""", and give the the question at the Bloom level of '''${prompt_BloomLevel}'''. In your response, DON'T mention the textbook, or bloom level. 
  
  ${previousQuestionsMessage} 
  
  Reply with ONLY JSON in the following format: ${questionFormat}`;
}

export function getQuestionMessages(
  payload: QuestionPayload
): ChatCompletionRequestMessage[] {
  const questionType = payload.data.type;
  const systemMessage = getSystemMessage(payload);
  const initialUserMessage = getInitialUserMessage(payload);
  // console.log("initialUserMessage", initialUserMessage);
  switch (questionType) {
    case "fillInTheBlanks":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "multipleChoiceSingleCorrect":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "trueFalse":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "shortAnswer":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "essay":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "project":
    case "debate":
    case "brainstorming":
    case "groupDiscussion":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    default:
      return [
        ...systemMessage,
        {
          role: "user",
          content: ``,
        },
      ];
  }
}

function getJsonPayload(payload: QuestionPayload): string {
  const { bloomLevel, topic, subtopic, grade, board, type } = payload.data;

  let basePayload = {
    question: "<question>",
    type: type,
    bloomLevel,
    // levelExplanation: "<whyLevelWasAssigned>",
    topic,
    subtopic,
    grade,
    curriculum: board,
  };

  let specificPayload;

  switch (type) {
    case "fillInTheBlanks":
      specificPayload = {
        ...basePayload,
        answer: "<correctOption>",
      };
      break;
    case "multipleChoiceSingleCorrect":
    case "trueFalse":
      specificPayload = {
        ...basePayload,
        options: "<options>",
        answer: "<correctOption>",
      };
      break;
    case "shortAnswer":
    case "essay":
      specificPayload = {
        ...basePayload,
        answer: "<SampleAnswer>",
      };
      break;
    default:
      throw new Error("Invalid question type");
  }

  return JSON.stringify(specificPayload);
}
