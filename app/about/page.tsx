import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <article className="page-content prose-content">
      <p className="text-center">Ho Chi Minh City, Vietnam.</p>
      <p className="text-center">
        <a href="mailto:hello@example.com">hello@example.com</a>
      </p>

      <p className="text-center italic">
        Good books are written in a kind of foreign language
        <span className="not-italic"> — Marcel Proust.</span>
      </p>

      <p>
        A personal space for writing, translation, and reflection on
        architecture, culture, and the everyday. Work here moves between
        languages and disciplines — notes from the studio, reading lists,
        field observations, and drafts in progress.
      </p>

      <p>
        #Phuong Blog: a place to collect essays, translations, and fragments
        that do not fit elsewhere.
      </p>

      <p>
        #Topics: architecture and art; space and territory; translation and
        reading; workshops and conversations.
      </p>

      <p>
        #Currently: building this site, gathering notes, and publishing in
        small pieces.
      </p>

      <p className="text-center divider">——</p>

      <p className="text-center">
        blog • a place for leisure, lecture, disputation, discussion.
      </p>
    </article>
  );
}
