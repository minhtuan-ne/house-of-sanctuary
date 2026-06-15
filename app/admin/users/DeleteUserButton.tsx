"use client";

import { deleteUser } from "@/app/actions/auth";
import s from "./admin.module.css";

export function DeleteUserButton({ userId, name }: { userId: string; name: string }) {
  async function handleDelete() {
    if (!confirm(`Delete "${name}"? They won't be able to sign in.`)) return;
    await deleteUser(userId);
  }

  return (
    <button type="button" onClick={handleDelete} className={s.deleteBtn} aria-label={`Delete ${name}`}>
      Delete
    </button>
  );
}
