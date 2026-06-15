"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { getCurrentUser } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) {
    return { error: "Name and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { name } });
  if (!user || user.deletedAt) {
    return { error: "Invalid credentials." };
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid credentials." };
  }

  await createSession({ userId: user.id, name: user.name, role: user.role });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function deleteUser(userId: string): Promise<void> {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "ADMIN") throw new Error("Unauthorized");
  if (actor.userId === userId) throw new Error("Cannot delete yourself");

  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/users");
}

export type CreateUserState = { error?: string; success?: string } | undefined;

export async function createUser(
  _prev: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const actor = await getCurrentUser();
  if (!actor || actor.role !== "ADMIN") {
    return { error: "Only admins can create users." };
  }

  const name = (formData.get("name") as string)?.trim();
  const password = formData.get("password") as string;

  if (!name || !password) {
    return { error: "Name and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { name } });
  if (existing) {
    return { error: "A user with that name already exists." };
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({ data: { name, passwordHash, role: "USER" } });

  return { success: `User "${name}" created.` };
}
