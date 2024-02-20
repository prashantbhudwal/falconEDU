const GRADE_SUBJECT_MAP = [
  {
    grade: "- Lower KG",
    subjects: ["Phonics", "Foundational Numeracy"],
  },
  {
    grade: "- Upper KG",
    subjects: ["Phonics", "Foundational Numeracy"],
  },
  {
    grade: "1",
    subjects: [
      "Phonics",
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Environmental Studies",
      "Science",
      "Social Studies",
      "Mathematics",
      "Hindi",
    ],
  },
  {
    grade: "2",
    subjects: [
      "Phonics",
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Environmental Studies",
      "Science",
      "Basics of Computers",
      "Mathematics",
      "Hindi",
    ],
  },
  {
    grade: "3",
    subjects: [
      "Phonics",
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Environmental Studies",
      "Science",
      "Basics of Computers",
      "Mathematics",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Hindi",
    ],
  },
  {
    grade: "4",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Environmental Studies",
      "Science",
      "Mathematics",
      "Basics of Computers",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Hindi",
    ],
  },
  {
    grade: "5",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Writing",
      "Languages - French",
      "Languages - Spanish",
      "Languages - German",
      "Environmental Studies",
      "Mathematics",
      "Science",
      "Science - Physics",
      "Science - Chemistry",
      "Science - Biology",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Social Studies - Economics",
      "Social Studies - Political Science",
      "Social Studies - Psychology",
      "Social Studies - Sociology",
      "Social Studies - Philosophy",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
      "Java",
      "Python",
      "Javascript",
      "Social Emotional Learning (SEL)",
      "Design Thinking",
      "Hindi",
    ],
  },
  {
    grade: "6",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Writing",
      "Languages - French",
      "Languages - Spanish",
      "Languages - German",
      "Environmental Studies",
      "Mathematics",
      "Science",
      "Science - Physics",
      "Science - Chemistry",
      "Science - Biology",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Social Studies - Economics",
      "Social Studies - Political Science",
      "Social Studies - Psychology",
      "Social Studies - Sociology",
      "Social Studies - Philosophy",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
      "Java",
      "Python",
      "Javascript",
      "Social Emotional Learning (SEL)",
      "Design Thinking",
      "Hindi",
    ],
  },
  {
    grade: "7",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Writing",
      "Languages - French",
      "Languages - Spanish",
      "Languages - German",
      "Environmental Studies",
      "Science",
      "Science - Physics",
      "Science - Chemistry",
      "Science - Biology",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Social Studies - Economics",
      "Social Studies - Political Science",
      "Social Studies - Psychology",
      "Social Studies - Sociology",
      "Social Studies - Philosophy",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
      "Java",
      "Python",
      "Javascript",
      "Social Emotional Learning (SEL)",
      "Design Thinking",
      "Mathematics",
      "Hindi",
    ],
  },
  {
    grade: "8",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Writing",
      "Languages - French",
      "Languages - Spanish",
      "Languages - German",
      "Environmental Studies",
      "Science - Physics",
      "Science - Chemistry",
      "Science - Biology",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Social Studies - Economics",
      "Social Studies - Political Science",
      "Social Studies - Psychology",
      "Social Studies - Sociology",
      "Social Studies - Philosophy",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
      "Java",
      "Python",
      "Javascript",
      "Social Emotional Learning (SEL)",
      "Design Thinking",
      "Mathematics",
      "Hindi",
    ],
  },
  {
    grade: "9",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Languages - French",
      "Languages - Spanish",
      "Languages - German",
      "Environmental Studies",
      "Science - Physics",
      "Science - Chemistry",
      "Science - Biology",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Social Studies - Economics",
      "Social Studies - Political Science",
      "Social Studies - Psychology",
      "Social Studies - Sociology",
      "Social Studies - Philosophy",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
      "Java",
      "Python",
      "Javascript",
      "Social Emotional Learning (SEL)",
      "Design Thinking",
      "Business Studies",
      "Mathematics",
      "Hindi",
    ],
  },
  {
    grade: "10",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Languages - French",
      "Languages - Spanish",
      "Languages - German",
      "Environmental Studies",
      "Science - Physics",
      "Science - Chemistry",
      "Science - Biology",
      "Social Studies",
      "Social Studies - History",
      "Social Studies - Geography",
      "Social Studies - Economics",
      "Social Studies - Political Science",
      "Social Studies - Psychology",
      "Social Studies - Sociology",
      "Social Studies - Philosophy",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
      "Java",
      "Python",
      "Javascript",
      "Social Emotional Learning (SEL)",
      "Design Thinking",
      "Business Studies",
      "Mathematics",
      "Hindi",
    ],
  },
];
export const gradeSubjectMap = new Map(
  GRADE_SUBJECT_MAP.map((item) => [item.grade, item.subjects]),
);
