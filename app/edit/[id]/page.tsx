import { prisma } from "@/lib/prisma";
import { updateTask } from "@/app/actions";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!task) {
    return <h1>Task not found</h1>;
  }

  const updateTaskWithId = updateTask.bind(null, task.id);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Edit Task</h1>

      <form action={updateTaskWithId}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            name="title"
            defaultValue={task.title}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            defaultValue={task.description}
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
            defaultValue={task.dueDate.toISOString().split("T")[0]}
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
            defaultValue={task.topic}
            required
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />
          <select
            name="status"
            defaultValue={task.status}
          >
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <br />

        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}