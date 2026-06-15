"use client";

import { useActionState } from "react";
import { createUser, type CreateUserState } from "@/app/actions/auth";
import s from "./admin.module.css";

export function CreateUserForm() {
  const [state, action, pending] = useActionState<CreateUserState, FormData>(
    createUser,
    undefined
  );

  return (
    <form action={action} className={s.form}>
      <div className={s.formHeader}>
        <h2 className={s.formTitle}>Add user</h2>
        <span className={s.formRule} aria-hidden="true">——</span>
      </div>

      {state?.error && (
        <p className={s.error} role="alert">{state.error}</p>
      )}
      {state?.success && (
        <p className={s.success} role="status">{state.success}</p>
      )}

      <div className={s.field}>
        <label htmlFor="new-name" className={s.label}>Name</label>
        <input
          id="new-name"
          name="name"
          type="text"
          required
          disabled={pending}
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label htmlFor="new-password" className={s.label}>Password</label>
        <input
          id="new-password"
          name="password"
          type="password"
          required
          disabled={pending}
          className={s.input}
        />
      </div>

      <button type="submit" disabled={pending} className={s.submit}>
        {pending ? "Creating…" : "Create user →"}
      </button>
    </form>
  );
}
