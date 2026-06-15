import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { WritingEditor } from "./WritingEditor";
import s from "./editor.module.css";

export const metadata = { title: "New writing" };

export default async function NewWritingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className={s.page}>
      <Link href="/writing" className={s.back}>← Writing</Link>
      <WritingEditor authorName={user.name} />
    </div>
  );
}
