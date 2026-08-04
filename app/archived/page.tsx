import { prisma } from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  Todo: "Todo",
  InProgress: "In Progress",
  Complete: "Complete",
};

const statusStyles: Record<string, string> = {
  Todo: "bg-slate-100 text-slate-700",
  InProgress: "bg-blue-100 text-blue-700",
  Complete: "bg-green-100 text-green-700",
};

export default async function ArchivedTasksPage() {
  const tasks = await prisma.task.findMany({
    where: {
      archived: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-black">
            Archived Tasks
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Previously archived tasks.
          </p>
        </div>

        <a
          href="/"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          ← Back to Active Tasks
        </a>
      </header>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            No archived tasks.
          </p>
        </div>
      ) : (
        <ul className="space-y-5">
          {tasks.map((task: (typeof tasks)[number]) => (
            <li
              key={task.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-black">
                  {task.title}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                >
                  {statusLabels[task.status]}
                </span>
              </div>

              <p className="mt-3 text-slate-600">
                {task.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-500">
                <span>
                  <strong>Topic:</strong> {task.topic}
                </span>

                <span>
                  <strong>Due:</strong>{" "}
                  {task.dueDate.toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}