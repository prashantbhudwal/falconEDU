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
      "History",
      "Geography",
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
      "History",
      "Geography",
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
      "Environmental Studies",
      "Mathematics",
      "Science",
      "Social Studies",
      "History",
      "Geography",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
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
      "French",
      "Spanish",
      "Environmental Studies",
      "Mathematics",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Social Studies",
      "History",
      "Geography",
      "Basics of Computers",
      "Information and Communications Technology (ICT)",
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
      "French",
      "Spanish",
      "Environmental Studies",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Social Studies",
      "History",
      "Geography",
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
      "French",
      "Spanish",
      "Environmental Studies",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Social Studies",
      "History",
      "Geography",
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
      "Writing",
      "French",
      "Spanish",
      "Environmental Studies",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Social Studies",
      "History",
      "Geography",
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
    grade: "10",
    subjects: [
      "English Grammar",
      "English Language",
      "Reading Comprehension",
      "Writing",
      "French",
      "Spanish",
      "Environmental Studies",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Social Studies",
      "History",
      "Geography",
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
];
export const gradeSubjectMap = new Map(
  GRADE_SUBJECT_MAP.map((item) => [item.grade, item.subjects]),
);
