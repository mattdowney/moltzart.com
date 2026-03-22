import { auth } from "@/lib/auth";

export async function getAdminAuth(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session.user.email;
}
