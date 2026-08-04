
import { prisma } from "@/lib/prisma";
import { createTask, archiveTask } from "./actions";
 
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
 
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
 
  const tasks = await prisma.task.findMany({
    where: {
      archived: false,
    },
    orderBy:
      sort === "topic"
        ? { topic: "asc" }
        : sort === "status"
        ? { status: "asc" }
        : sort === "dueDate"
        ? { dueDate: "asc" }
        : { createdAt: "desc" },
  });
 
  const sortOptions = [
    { key: undefined, label: "Newest" },
    { key: "dueDate", label: "Due Date" },
    { key: "topic", label: "Topic" },
    { key: "status", label: "Status" },
  ];
 
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Todo App</h1>
          <p className="mt-1 text-sm text-slate-500">Stay on top of your tasks</p>
        </div>
        <a
          href="/archived"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Archived →
        </a>
      </header>
 
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-black">Create a new task</h2>
        <form action={createTask} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
 
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
 
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Topic
              </label>
              <input
                type="text"
                name="topic"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
 
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create Task
          </button>
        </form>
      </section>
 
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-slate-500">Sort:</span>
        {sortOptions.map((option) => {
          const isActive = sort === option.key || (!sort && !option.key);
          return (
            <a
              key={option.label}
              href={option.key ? `/?sort=${option.key}` : "/"}
              className={`rounded-full px-3 py-1 font-medium ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </a>
          );
        })}
      </div>
 
      <h2 className="mb-3 text-base font-semibold">Tasks</h2>
 
      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No tasks yet. Create one above to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task: (typeof tasks)[number]) => {
            const isOverdue =
              task.dueDate < new Date() && task.status !== "Complete";
 
            return (
              <li
                key={task.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-black">{task.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}
                  >
                    {statusLabels[task.status]}
                  </span>
                </div>
 
                <p className="mt-1 text-sm text-slate-600">{task.description}</p>
 
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Topic: {task.topic}</span>
                  <span>Due: {task.dueDate.toLocaleDateString()}</span>
                </div>
 
                {isOverdue && (
                  <span className="mt-3 inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                    ⚠ OVERDUE
                  </span>
                )}
 
                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={`/edit/${task.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Edit
                  </a>
                  <form action={archiveTask.bind(null, task.id)}>
                    <button
                      type="submit"
                      className="text-sm font-medium text-slate-500 hover:text-slate-700"
                    >
                      Archive
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
 
