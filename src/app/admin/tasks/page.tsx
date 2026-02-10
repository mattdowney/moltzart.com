import { fetchTasks } from "@/lib/github";
import { TasksView } from "@/components/tasks-view";

export const dynamic = "force-dynamic";

export default async function AdminTasks() {
  const data = await fetchTasks();
  return <TasksView initialData={data} />;
}
