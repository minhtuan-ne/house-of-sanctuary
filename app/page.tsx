import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const photos = [
  { src: "/photos/01.jpg", alt: "" },
  { src: "/photos/02.jpg", alt: "" },
  { src: "/photos/03.jpg", alt: "" },
];

type HomeProps = { searchParams: Promise<{ s?: string }> };

export default async function Home({ searchParams }: HomeProps) {
  const { s } = await searchParams;

  if (s) {
    const results = await prisma.writing.findMany({
      where: {
        deletedAt: null,
        author: { deletedAt: null },
        OR: [
          { title: { contains: s, mode: "insensitive" } },
          { content: { contains: s, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    });

    return (
      <div className="search-results-page">
        <p className="search-results-page__meta">
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{s}&rdquo;
        </p>
        {results.length === 0 ? (
          <p className="search-results-page__empty">No writings found.</p>
        ) : (
          <ul className="search-results-list">
            {results.map((post) => {
              const date = post.createdAt.toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              });
              return (
                <li key={post.slug} className="search-result">
                  <Link href={`/writing/${post.slug}`} className="search-result__title">
                    {post.title}
                  </Link>
                  <p className="search-result__meta">{post.author.name} · {date}</p>
                  {post.excerpt && (
                    <p className="search-result__excerpt">{post.excerpt}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="home-grid">
      <div className="home-grid__row">
        <div className="home-grid__cell">
          <Image src={photos[0].src} alt={photos[0].alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 1100px) calc(50vw - 2rem), 533px" priority />
        </div>
        <div className="home-grid__cell">
          <Image src={photos[1].src} alt={photos[1].alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 1100px) calc(50vw - 2rem), 533px" priority />
        </div>
      </div>
      <div className="home-grid__row home-grid__row--full">
        <div className="home-grid__cell">
          <Image src={photos[2].src} alt={photos[2].alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 1100px) calc(100vw - 3rem), 1067px" />
        </div>
      </div>
      <blockquote className="home-quote">
        <p>&ldquo;die sprache ist das haus des seins&rdquo;</p>
        <p className="home-quote__vn">ngôn ngữ là ngôi nhà của hữu thể</p>
        <cite>— Heidegger</cite>
      </blockquote>
    </div>
  );
}
