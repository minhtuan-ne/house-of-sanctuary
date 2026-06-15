import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.writing.findUnique({
    where: { slug, deletedAt: null, author: { deletedAt: null } },
    select: { title: true },
  });
  return { title: post?.title ?? "Writing" };
}

export default async function WritingPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.writing.findUnique({
    where: { slug, deletedAt: null, author: { deletedAt: null } },
    select: {
      title: true,
      content: true,
      coverImage: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });

  if (!post) notFound();

  const date = post.createdAt.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <article>
      {post.coverImage && (
        <div className="writing-post__cover">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="page-content prose-content">
        <p>
          <Link href="/writing" className="writing-back">← Writing</Link>
        </p>

        <h1>{post.title}</h1>

        <p className="writing-post__meta">
          {post.author.name} · {date}
        </p>

        <div
          className="writing-post__body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
