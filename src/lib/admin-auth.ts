import { cookies } from "next/headers";

export async function getAdminAuth(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.TASKS_PASSWORD) return null;
  return token;
}
