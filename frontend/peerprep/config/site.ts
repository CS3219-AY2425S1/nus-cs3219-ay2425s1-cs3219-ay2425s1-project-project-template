export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: "bxs-home",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: "bxs-cog",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: "bxs-trophy"
    },
  ],
};
