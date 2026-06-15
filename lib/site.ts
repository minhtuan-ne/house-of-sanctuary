export const siteName = "house of sanctuary";

export const navItems = [
  { href: "/about", label: "ABOUT" },
  { href: "/work", label: "STUDIO WORK" },
  { href: "/writing", label: "WRITING" },
] as const;

export type WritingPost = {
  slug: string;
  title: string;
  excerpt: string;
  imageAlt: string;
};