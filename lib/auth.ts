import "server-only";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export type SessionUser = {
  userId: string;
  name: string;
  role: string;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session) return null;

  // Stale cookie from before UUID migration — userId would be a number
  if (typeof session.userId !== "string") return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, role: true, deletedAt: true },
  });

  if (!dbUser || dbUser.deletedAt) return null;

  return { userId: dbUser.id, name: dbUser.name, role: dbUser.role };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
