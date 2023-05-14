export type Questions = {
  fillInTheBlanks?: FillInTheBlanks[];
  multipleChoiceSingleCorrect?: MultipleChoiceSingleCorrect[];
  trueFalse?: TrueFalse[];
  shortAnswer?: ShortAnswer[];
  essay?: Essay[];
  longAnswer?: LongAnswer[];
  matchTheFollowing?: MatchTheFollowing[];
  multipleChoiceMultipleCorrect?: MultipleChoiceMultipleCorrect[];
  oralTest?: OralTest[];
  project?: Project[];
  caseStudy?: CaseStudy[];
  debate?: Debate[];
  brainstorming?: Brainstorming[];
  groupDiscussion?: GroupDiscussion[];
  workshop?: Workshop[];
  symposium?: Symposium[];
  panelDiscussion?: PanelDiscussion[];
};

export type QuestionType =
  | "fillInTheBlanks"
  | "multipleChoiceSingleCorrect"
  | "trueFalse"
  | "shortAnswer"
  | "essay"
  | "longAnswer"
  | "matchTheFollowing"
  | "multipleChoiceMultipleCorrect"
  | "oralTest"
  | "project"
  | "caseStudy"
  | "debate"
  | "brainstorming"
  | "groupDiscussion"
  | "workshop"
  | "symposium"
  | "panelDiscussion";
export interface BaseQuestion {
  type: QuestionType;
  questionId?: string;
  question?: string;
  bloomLevel?: string;
  topic?: string;
  subtopic?: string;
  grade?: string;
  bloomLevelExplanation?: string;
  board?: string;
  explanation?: string;
  learningObjectives?: string[];
  tags?: string[];
  author?: string;
}

export interface TrueFalse extends BaseQuestion {
  answer?: string;
}

export interface ShortAnswer extends BaseQuestion {
  answer?: string;
}

export interface Essay extends BaseQuestion {
  answer: string;
}

export interface LongAnswer extends BaseQuestion {
  answer?: string;
}

export interface FillInTheBlanks extends BaseQuestion {
  answer?: string;
}

export interface MatchTheFollowing extends BaseQuestion {
  answer?: string;
}

export interface MultipleChoiceSingleCorrect extends BaseQuestion {
  options?: string[];
  answer?: string;
}

export interface MultipleChoiceMultipleCorrect extends BaseQuestion {
  options?: string[];
  answer?: string[];
}

export interface OralTest extends BaseQuestion {
  answer?: string;
}

export interface Project extends BaseQuestion {
  materials?: string[];
  teacherSupport?: string;
}

export interface CaseStudy extends BaseQuestion {
  teacherSupport?: string;
}

export interface Debate extends BaseQuestion {
  teacherSupport: string;
}

export interface Brainstorming extends BaseQuestion {
  teacherSupport?: string;
}

export interface GroupDiscussion extends BaseQuestion {
  teacherSupport?: string;
}

export interface Workshop extends BaseQuestion {
  materials?: string[];
  teacherSupport?: string;
}

export interface Symposium extends BaseQuestion {
  teacherSupport?: string;
}

export interface PanelDiscussion extends BaseQuestion {
  teacherSupport?: string;
}

export type Question =
  | FillInTheBlanks
  | MultipleChoiceSingleCorrect
  | TrueFalse
  | ShortAnswer
  | Essay
  | LongAnswer
  | MatchTheFollowing
  | MultipleChoiceMultipleCorrect
  | OralTest
  | Project
  | CaseStudy
  | Debate
  | Brainstorming
  | GroupDiscussion
  | Workshop
  | Symposium
  | PanelDiscussion;
