"use client";

import { deleteWriting } from "@/app/actions/writing";

export function DeletePostButton({ writingId }: { writingId: string }) {
  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await deleteWriting(writingId);
  }

  return (
    <button type="button" onClick={handleDelete} className="post-action-btn post-action-btn--delete">
      Delete
    </button>
  );
}
