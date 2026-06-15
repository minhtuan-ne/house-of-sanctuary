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

export const writingPosts: WritingPost[] = [
  {
    slug: "on-writing",
    title: "On Writing",
    excerpt:
      "A short reflection on language, translation, and the space between thought and form...",
    imageAlt: "On Writing",
  },
  {
    slug: "notes-from-the-studio",
    title: "Notes from the Studio",
    excerpt:
      "Fragments from ongoing work — sketches, margins, and half-finished sentences...",
    imageAlt: "Notes from the Studio",
  },
  {
    slug: "reading-list",
    title: "Reading List",
    excerpt:
      "Books that shaped recent thinking: architecture, philosophy, and everyday life...",
    imageAlt: "Reading List",
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    excerpt:
      "Observations from site visits, walks, and the quiet details of built space...",
    imageAlt: "Field Notes",
  },
  {
    slug: "translation-draft",
    title: "Translation Draft",
    excerpt:
      "An early passage in progress — words moving between languages and contexts...",
    imageAlt: "Translation Draft",
  },
  {
    slug: "workshop-recap",
    title: "Workshop Recap",
    excerpt:
      "Summary of a recent reading group: questions raised, passages shared...",
    imageAlt: "Workshop Recap",
  },
];
