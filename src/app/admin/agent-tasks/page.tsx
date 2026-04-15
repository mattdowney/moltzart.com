import { fetchAgentTasksDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAgentTasks() {
  const rows = await fetchAgentTasksDb();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Agent tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Read-only. Tasks created by agents without the human ingest token.
          Cron-pattern rows are routed to <code>/admin/cron</code>.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No agent-sourced tasks.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Assigned</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="py-2 pr-4 font-medium">{t.title}</td>
                <td className="py-2 pr-4">{t.status}</td>
                <td className="py-2 pr-4">{t.assigned_to ?? "—"}</td>
                <td className="py-2 pr-4 text-muted-foreground">{t.created_at}</td>
                <td className="py-2 text-muted-foreground">{t.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
