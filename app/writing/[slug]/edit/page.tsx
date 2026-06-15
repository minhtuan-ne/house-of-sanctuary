import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { WritingEditor } from "@/app/writing/new/WritingEditor";

type PageProps = { params: Promise<{ slug: string }> };

export default async function EditWritingPage({ params }: PageProps) {
  const { slug } = await params;

  const [post, currentUser] = await Promise.all([
    prisma.writing.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true, title: true, content: true, coverImage: true, authorId: true, author: { select: { name: true } } },
    }),
    getCurrentUser(),
  ]);

  if (!post) notFound();
  if (!currentUser) redirect("/login");
  if (currentUser.role !== "ADMIN" && currentUser.userId !== post.authorId) notFound();

  return (
    <div className="page-content">
      <WritingEditor
        authorName={post.author.name}
        mode="edit"
        postId={post.id}
        postSlug={slug}
        initialTitle={post.title}
        initialContent={post.content}
        initialCoverImage={post.coverImage}
      />
    </div>
  );
}
