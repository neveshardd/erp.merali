import { prisma } from "./prisma";

export type NotificationType = "success" | "warning" | "info" | "error";

interface CreateNotificationParams {
  title: string;
  description: string;
  type?: NotificationType;
  link?: string;
}

export async function createNotification({
  title,
  description,
  type = "info",
  link,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        description,
        type,
        link,
      },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}
