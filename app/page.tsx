import { prisma } from "@/lib/prisma";
import { createTask, archiveTask } from "./actions";

export default async function Home() {
  const tasks = await prisma.task.findMany({
    where: {
      archived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Todo App</h1>

      <form action={createTask}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            name="title"
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            required
          />
        </div>

        <br />

        <div>
          <label>Due Date</label>
          <br />
          <input
            type="date"
            name="dueDate"
            required
          />
        </div>

        <br />

        <div>
          <label>Topic</label>
          <br />
          <input
            type="text"
            name="topic"
            required
          />
        </div>

        <br />

        <button type="submit">
          Create Task
        </button>
      </form>

      <hr />

       <p>
        <a href="/archived">View Archived Tasks</a>
      </p>

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
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
              <br />
              <a href={`/edit/${task.id}`}>Edit</a>

              <br />

              <form action={archiveTask.bind(null, task.id)}>
                <button type="submit">
                   Archive
                </button>
              </form>



           </li>
         ))}
      </ul>
      )}
    </main>
  );
}