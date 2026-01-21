import prisma from "@LockedIn/db";

export async function createNotification(data: {
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: any;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        type: data.type,
        data: data.data || {},
      },
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}
