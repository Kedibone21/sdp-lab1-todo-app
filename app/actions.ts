"use server";

import { prisma } from "@/lib/prisma";

import { redirect } from "next/navigation";


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

  redirect("/");
}

export async function updateTask(
  id: number,
  formData: FormData
) {
  await prisma.task.update({
    where: {
      id,
    },
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      topic: formData.get("topic") as string,
      dueDate: new Date(formData.get("dueDate") as string),
      status: formData.get("status") as "Todo" | "InProgress" | "Complete",
    },
  });

  redirect("/");
}

export async function archiveTask(id: number) {
  await prisma.task.update({
    where: {
      id,
    },
    data: {
      archived: true,
    },
  });

  redirect("/");
}