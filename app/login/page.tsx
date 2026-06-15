import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { siteName } from "@/lib/site";
import s from "./login.module.css";

export const metadata = { robots: "noindex" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <div className={s.page}>
      <Link href="/" className={s.back}>{siteName}</Link>
      <LoginForm />
      <p className={s.note}>Private access only.</p>
    </div>
  );
}
