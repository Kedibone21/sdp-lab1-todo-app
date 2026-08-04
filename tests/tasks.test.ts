import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Todo application", () => {
  it("creates a task in the database", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Test task",
        description: "This is a test task",
        dueDate: new Date("2026-08-10"),
        topic: "Testing",
      },
    });

    expect(task.title).toBe("Test task");
    expect(task.description).toBe("This is a test task");
    expect(task.topic).toBe("Testing");
    expect(task.dueDate).toEqual(new Date("2026-08-10"));
    expect(task.status).toBe("Todo");
    expect(task.archived).toBe(false);
  });

  it("updates an existing task", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Original title",
        description: "Original description",
        dueDate: new Date("2026-08-10"),
        topic: "Original topic",
      },
    });

    const updatedTask = await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        title: "Updated title",
        description: "Updated description",
        topic: "Updated topic",
      },
    });

    expect(updatedTask.title).toBe("Updated title");
    expect(updatedTask.description).toBe("Updated description");
    expect(updatedTask.topic).toBe("Updated topic");
  });
});

it("archives an existing task without deleting it", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Task to archive",
        description: "This task will be archived",
        dueDate: new Date("2026-08-10"),
        topic: "Testing",
      },
    });

    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        archived: true,
      },
    });

    const archivedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(archivedTask).not.toBeNull();
    expect(archivedTask?.archived).toBe(true);
  });

    it("identifies an incomplete task with a past due date as overdue", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Overdue task",
        description: "This task is past its due date",
        dueDate: new Date("2026-08-01"),
        topic: "Testing",
      },
    });

    const isOverdue =
      task.dueDate < new Date() &&
      task.status !== "Complete";

    expect(isOverdue).toBe(true);
  });