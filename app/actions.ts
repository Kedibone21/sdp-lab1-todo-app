"use server";

import { prisma } from "@/lib/prisma";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;
  const topic = formData.get("topic") as string;

  await prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      topic,
    },
  });
}