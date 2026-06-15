import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DeleteWritingButton } from "./DeleteWritingButton";

export const metadata: Metadata = { title: "My Writing" };

export default async function ManageWritingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const posts = await prisma.writing.findMany({
    where: {
      deletedAt: null,
      ...(user.role === "ADMIN" ? {} : { authorId: user.userId }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div className="page-content">
      <h1 className="manage-writing__heading">
        {user.role === "ADMIN" ? "All writing" : "My writing"}
      </h1>

      {posts.length === 0 ? (
        <p className="manage-writing__empty">No posts yet. <Link href="/writing/new">Write something →</Link></p>
      ) : (
        <table className="manage-writing__table">
          <thead>
            <tr>
              <th>Writing</th>
              {user.role === "ADMIN" && <th>Author</th>}
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link href={`/writing/${post.slug}`} className="manage-writing__title-link">
                    {post.title}
                  </Link>
                  {post.excerpt && (
                    <p className="manage-writing__excerpt">{post.excerpt}</p>
                  )}
                </td>
                {user.role === "ADMIN" && <td className="manage-writing__author">{post.author.name}</td>}
                <td className="manage-writing__date">
                  {post.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="manage-writing__actions">
                  <Link href={`/writing/${post.slug}/edit`} className="manage-writing__action">
                    Edit
                  </Link>
                  <DeleteWritingButton writingId={post.id} title={post.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
