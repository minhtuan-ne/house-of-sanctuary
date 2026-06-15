import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Writing" };

export default async function WritingPage() {
  const [user, posts] = await Promise.all([
    getCurrentUser(),
    prisma.writing.findMany({
      where: { deletedAt: null, author: { deletedAt: null } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),
  ]);

  return (
    <>
      {user && (
        <div className="writing-page__toolbar">
          <Link href="/writing/new" className="writing-page__new-btn">
            + New writing
          </Link>
        </div>
      )}
      <section className="writing-grid">
        {posts.map((post, index) => (
          <article key={post.id} className="writing-card">
            <Link href={`/writing/${post.slug}`} className="writing-card__link">
              <div className="writing-card__media" style={!post.coverImage ? { backgroundColor: `hsl(${(index * 47) % 360} 12% 88%)` } : undefined}>
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                  />
                ) : null}
                <span className="writing-card__overlay" aria-hidden="true">→</span>
              </div>
              <div className="writing-card__body">
                <h2 className="writing-card__title">{post.title}</h2>
                {post.excerpt && <p className="writing-card__excerpt">{post.excerpt}</p>}
                <span className="writing-card__more">Read More</span>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
