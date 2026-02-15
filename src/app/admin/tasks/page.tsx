import { fetchTasksDb } from "@/lib/db";
import { TasksView } from "@/components/tasks-view";

export const dynamic = "force-dynamic";

export default async function AdminTasks() {
  const data = await fetchTasksDb();
  return <TasksView initialData={data} />;
}
