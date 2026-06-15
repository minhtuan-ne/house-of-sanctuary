"use client";

import { deleteWriting } from "@/app/actions/writing";

export function DeleteWritingButton({ writingId, title }: { writingId: string; title: string }) {
  async function handleDelete() {
    if (!confirm(`Delete "${title}"?`)) return;
    await deleteWriting(writingId);
  }

  return (
    <button type="button" onClick={handleDelete} className="manage-writing__action manage-writing__action--delete">
      Delete
    </button>
  );
}
