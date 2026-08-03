import { prisma } from "@/lib/prisma";

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
    <main style={{ padding: "2rem" }}>
      <h1>Archived Tasks</h1>

      <a href="/">← Back to Active Tasks</a>

      <hr />

      {tasks.length === 0 ? (
        <p>No archived tasks.</p>
      ) : (
        <ul>
          {tasks.map((task: (typeof tasks)[number]) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <br />
              {task.description}
              <br />
              {task.topic}
              <br />
              {task.status}
              <br />
              {task.dueDate.toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}