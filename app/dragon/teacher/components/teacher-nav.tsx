const teacherNavConfig = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
  },
  {
    name: "Students",
    path: "/students",
    icon: "user",
  },
  {
    name: "Courses",
    path: "/courses",
    icon: "book",
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: "file",
  },
  {
    name: "Grades",
    path: "/grades",
    icon: "file",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "setting",
  },
];

export function TeacherNav() {
  return (
    <nav className="bg-base-200 w-full max-w-[240px] flex flex-col custom-scrollbar overflow-y-auto"></nav>
  );
}

function TeacherNavItem() {
  return null;
}
