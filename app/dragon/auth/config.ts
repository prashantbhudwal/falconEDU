export const authConfig = [
  {
    type: "student",
    headline: "AI for Students",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "Student Sign In",
    buttonVariant: "default",
    auth: "google-student",
    subtext: "Works on mobile phones and laptop.",
    image: "/chubbi.png",
    callbackUrl: "/dragon/student",
  },
  {
    type: "teacher",
    headline: "AI for Teachers",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "Teacher Sign In",
    buttonVariant: "secondary",
    auth: "google",
    subtext: "Works on large screens only.",
    image: "/chubbi.png",
    callbackUrl: "/dragon/teacher",
  },

  {
    type: "org-admin",
    headline: "AI for Org Admins",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "School Admin Sign In",
    buttonVariant: "secondary",
    auth: "google",
    subtext: "Works on large screens only.",
    image: "/chubbi.png",
    callbackUrl: "/dragon/org-admin",
  },
  {
    type: "parent",
    headline: "AI for Parents",
    description:
      "Access your teacher's lesson plans, worksheets, activities and assessments with AI that is easy to use and strictly follows your syllabus.",
    buttonText: "Parent Sign In",
    buttonVariant: "secondary",
    auth: "google-parent",
    subtext: "Works on large screens only.",
    image: "/chubbi.png",
    callbackUrl: "/dragon/parent",
  },
] as const;
