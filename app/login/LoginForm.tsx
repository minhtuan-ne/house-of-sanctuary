"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import s from "./login.module.css";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} className={s.form}>
      <div className={s.formHeader}>
        <h1 className={s.title}>Sign in</h1>
        <span className={s.rule} aria-hidden="true">——</span>
      </div>

      {state?.error && (
        <p className={s.error} role="alert">{state.error}</p>
      )}

      <div className={s.field}>
        <label htmlFor="name" className={s.label}>Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="username"
          required
          disabled={pending}
          className={s.input}
        />
      </div>

      <div className={s.field}>
        <label htmlFor="password" className={s.label}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          className={s.input}
        />
      </div>

      <button type="submit" disabled={pending} className={s.submit}>
        {pending ? "Signing in…" : "Sign in →"}
      </button>
    </form>
  );
}
