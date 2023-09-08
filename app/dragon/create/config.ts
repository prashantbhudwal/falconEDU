const root = "/dragon/create";

const sidebarRoot = `${root}/bot/[id]`;
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

export const getBotLink = (id: string) =>
  `${root}/bot/${id}/bot-preferences`;
