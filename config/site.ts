export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  url: 'https://www.mkutay.dev',
  name: "Kutay's Blog",
  description: "A blog where university student Kutay posts about things he likes, from mathematics to computer science.",
  postNumPerPage: 5,
  navItems: [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Guest Book",
      href: "/guestbook",
    },
    {
      label: "Posts",
      href: "/posts/page/1",
    },
  ],
  navMenuItems: [
    {
      label: "Home Page",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Posts",
      href: "/posts/page/1",
    },
  ],
};