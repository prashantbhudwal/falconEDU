const root = "/dragon/create";

const sidebarRoot = `${root}/bot/edit-bot/[id]`;
const teacherPreferences = `${root}/teacher-preferences`;

export const sidebarNavItems = [
  {
    title: "Teacher Preferences",
    href: `${teacherPreferences}`,
  },
  {
    title: "Bot Preferences",
    href: `${sidebarRoot}/bot/edit-bot`,
  },
];

export const getBotLink = (id: string) => `${root}/bot/edit-bot/${id}`;
