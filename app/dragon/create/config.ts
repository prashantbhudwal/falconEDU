const root = "/dragon/create";

const sidebarRoot = `${root}/agent/[id]`;
const teacherPreferences = `${root}/teacher-preferences`;

export const sidebarNavItems = [
  {
    title: "Teacher Preferences",
    href: `${teacherPreferences}`,
  },
  {
    title: "Bot Preferences",
    href: `${sidebarRoot}/bot-preferences`,
  },
];

export const getAgentLink = (id: string) =>
  `${root}/agent/${id}/bot-preferences`;
