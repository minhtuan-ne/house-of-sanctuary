import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateUserForm } from "./CreateUserForm";
import { DeleteUserButton } from "./DeleteUserButton";
import s from "./admin.module.css";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, role: true, createdAt: true, deletedAt: true },
  });

  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Users</h1>
        <span className={s.count}>{users.length}</span>
      </div>

      <table className={s.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const deleted = !!u.deletedAt;
            return (
              <tr key={u.id} className={deleted ? s.rowDeleted : undefined}>
                <td>
                  <span className={deleted ? s.nameDeleted : undefined}>{u.name}</span>
                  {deleted && <span className={s.deletedTag}>deleted</span>}
                </td>
                <td>
                  <span className={`${s.roleBadge} ${u.role === "ADMIN" ? s.roleBadgeAdmin : ""}`}>
                    {u.role}
                  </span>
                </td>
                <td className={s.muted}>
                  {u.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className={s.actionCell}>
                  {!deleted && u.id !== actor.userId && (
                    <DeleteUserButton userId={u.id} name={u.name} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={s.section}>
        <CreateUserForm />
      </div>
    </div>
  );
}
