"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function toExcerpt(html: string, maxLen = 160): string {
  const text = decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, text.lastIndexOf(" ", maxLen)).trimEnd() + "…";
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function createWriting(formData: FormData) {
  const user = await requireAuth();

  const title = (formData.get("title") as string)?.trim();
  const content = formData.get("content") as string;
  const excerpt = content ? toExcerpt(content) : null;
  const coverImage = (formData.get("coverImage") as string) || null;

  if (!title) throw new Error("Title is required");

  const id = crypto.randomUUID();
  const slug = `${toSlug(title)}-${id.slice(0, 8)}`;

  await prisma.writing.create({
    data: { id, title, slug, excerpt, content: content ?? "", coverImage, authorId: user.userId },
  });

  redirect("/writing");
}

export async function updateWriting(writingId: string, formData: FormData) {
  const user = await requireAuth();

  const writing = await prisma.writing.findUnique({
    where: { id: writingId, deletedAt: null },
    select: { authorId: true, slug: true },
  });
  if (!writing) throw new Error("Not found");
  if (user.role !== "ADMIN" && writing.authorId !== user.userId) throw new Error("Unauthorized");

  const title = (formData.get("title") as string)?.trim();
  const content = formData.get("content") as string;
  const coverImage = (formData.get("coverImage") as string) || null;
  const excerpt = content ? toExcerpt(content) : null;

  if (!title) throw new Error("Title is required");

  await prisma.writing.update({
    where: { id: writingId },
    data: { title, content: content ?? "", excerpt, coverImage },
  });

  revalidatePath(`/writing/${writing.slug}`);
  redirect(`/writing/${writing.slug}`);
}

export async function deleteWriting(writingId: string) {
  const user = await requireAuth();

  const writing = await prisma.writing.findUnique({
    where: { id: writingId, deletedAt: null },
    select: { authorId: true },
  });
  if (!writing) throw new Error("Not found");
  if (user.role !== "ADMIN" && writing.authorId !== user.userId) throw new Error("Unauthorized");

  await prisma.writing.update({
    where: { id: writingId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/writing");
  revalidatePath("/writing/manage");
  redirect("/writing/manage");
}
