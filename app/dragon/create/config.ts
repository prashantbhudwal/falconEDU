const root = "/dragon/create";

const sidebarRoot = `${root}/bot/bot-preferences/[id]`;
const teacherPreferences = `${root}/teacher-preferences`;

export const sidebarNavItems = [
  {
    title: "Teacher Preferences",
    href: `${teacherPreferences}`,
  },
  {
    title: "Bot Preferences",
    href: `${sidebarRoot}/bot/bot-preferences`,
  },
];

export const getBotLink = (id: string) => `${root}/bot/bot-preferences/${id}`;
