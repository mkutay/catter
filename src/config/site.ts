export const siteConfig = {
  url: "https://www.mkutay.dev",
  name: "The Deterministic",
  author: "Mehmet Kutay Bozkurt",
  description:
    "A blog that talks about various things from mathematics to computer science and from philosophy to life updates.",
  navItems: [
    { label: "About", href: "/about" },
    { label: "Guest Book", href: "/guestbook" },
    { label: "Projects", href: "/projects" },
    { label: "Posts", href: "/posts" },
  ],
  footerItems: {
    connections: [
      {
        title: "BlueSky",
        link: "https://bsky.app/profile/mkutay.substack.com",
      },
      { title: "Instagram", link: "https://www.instagram.com/mkutaybozkurt" },
      { title: "GitHub", link: "https://github.com/mkutay" },
      { title: "LinkedIn", link: "https://www.linkedin.com/in/mkutay" },
    ],
    blog: [
      { title: "Sponsor Me", link: "https://github.com/sponsors/mkutay?o=esb" },
      { title: "Substack", link: "https://mkutay.substack.com" },
      { title: "RSS Feed", link: "/feed.xml" },
      { title: "Admin", link: "/admin" },
    ],
  },
  tagsThatShouldBeCapital: ["ib", "ai"],
  postNumPerPage: 5,
  newsletterSubscribe: "https://mkutay.substack.com/subscribe",
  admins: ["me@mkutay.dev", "hello@mkutay.dev"],
  date: new Date().toISOString().split("T")[0],
  homePage: {
    leftSideSlugs: ["creating-a-clone-of-yourself", "skip-list"],
    rightSideSlugs: ["some-reflection-on-writing", "why-mathematics-is-lonely"],
    middleSlug: "java-and-education",
    firstSlug: "history-of-chess-computers-the-minimax",
  },
  invisible: "invisible",
  noParentheses: "no-parentheses",
};
