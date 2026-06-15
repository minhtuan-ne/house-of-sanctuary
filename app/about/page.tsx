import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <article className="page-content prose-content about-content">
      <p className="text-center">
        <strong>家: [</strong>danh từ<strong>] 'ngôi nhà' trong tiếng Nhật.</strong><br />
        <strong>• いえ - 'nhà' theo nghĩa Kiến trúc, không gian sống</strong><br />
        <strong>• うち - 'nhà' của riêng tôi</strong><br />
        「うちへ帰ります」 - 'Tôi về Nhà đây.'
      </p>

      <p className="text-center">
        archives, thoughts and notes on architecture, studio works, literature/poems,
        linguistics, and history, with occasional detours into film and music.
      </p>

      <p className="text-center">cảm ơn vì đã ghé chơi.</p>

      <p className="about-sig">- claire -</p>
    </article>
  );
}
